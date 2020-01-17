import test from "ava";
import MovementValidator from "../../server/services/validation/MovementValidator";
import MovementService from "../../model/movement/MovementService";
import movementTypes from "../../model/movement/movementTypes";
import MovementOrder from "../../model/movement/MovementOrder";
import hexagon from "../../model/hexagon";
import Ship from "../../model/unit/Ship.mjs";

import Thruster from "../../model/unit/system/thruster/Thruster.mjs";
import Engine from "../../model/unit/system/engine/Engine.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";
import ManeuveringThruster from "../../model/unit/system/thruster/ManeuveringThruster.mjs";
import OutputReduced from "../../model/unit/system/criticals/OutputReduced.mjs";

const startMove = new MovementOrder(
  -1,
  movementTypes.START,
  new hexagon.Offset(-32, 5),
  new hexagon.Offset(3, 2),
  0,
  false,
  999
);

const deployMove = new MovementOrder(
  -1,
  movementTypes.DEPLOY,
  new hexagon.Offset(3, 2),
  startMove.velocity,
  startMove.facing,
  startMove.rolled,
  999
);

const getMovementService = () =>
  new MovementService().update({ turn: 999 }, { relayEvent: () => null });

const constructShip = (id = 123) => {
  let ship = new Ship({
    id
  });

  ship.accelcost = 3;
  ship.rollcost = 3;
  ship.pivotcost = 3;
  ship.evasioncost = 3;
  ship.systems.addPrimarySystem([
    new Thruster({ id: 1, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 2, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 8, hitpoints: 10, armor: 3 }, 5, [1, 2]),
    new Thruster({ id: 9, hitpoints: 10, armor: 3 }, 5, [4, 5]),
    new Thruster({ id: 3, hitpoints: 10, armor: 3 }, 5, 3),
    new Thruster({ id: 4, hitpoints: 10, armor: 3 }, 5, 3),
    new ManeuveringThruster({ id: 10, hitpoints: 10, armor: 3 }, 9, 3),
    new Engine({ id: 5, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20)
  ]);

  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = id => {
  const ship = constructShip(id);
  ship.movement.addMovement(deployMove);
  return ship;
};

const compareMovements = (test, moves1, moves2) => {
  test.deepEqual(
    moves1.map(move => move.clone().setRequiredThrust(null)),
    moves2.map(move => move.clone().setRequiredThrust(null))
  );
};

test("Valid movement", test => {
  const ship = constructDeployedShip();
  const movementService = getMovementService();

  movementService.roll(ship);
  movementService.evade(ship, 1);
  movementService.pivot(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);

  const validator = new MovementValidator(ship, 999, deployMove);
  test.true(validator.validate());
});

test("Ship accelcost has been tampered", test => {
  const ship = constructDeployedShip();
  const movementService = getMovementService();

  ship.accelcost = 1;
  movementService.roll(ship);
  movementService.evade(ship, 1);
  movementService.pivot(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);
  ship.accelcost = 3;

  const validator = new MovementValidator(ship, 999, deployMove);
  const error = test.throws(() => validator.validate());
  test.is(error.message, "Requirements are not correct.");
});

test("Ship pivotcost has been tampered", test => {
  const ship = constructDeployedShip();
  const movementService = getMovementService();

  ship.pivotcost = 1;
  movementService.roll(ship);
  movementService.evade(ship, 1);
  movementService.pivot(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);
  ship.pivotcost = 3;

  const validator = new MovementValidator(ship, 999, deployMove);
  const error = test.throws(() => validator.validate());
  test.is(error.message, "Requirements are not correct.");
});

test("Ship rollcost has been tampered", test => {
  const ship = constructDeployedShip();
  const movementService = getMovementService();

  ship.rollcost = 0;
  movementService.roll(ship);
  movementService.evade(ship, 1);
  movementService.pivot(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);
  ship.rollcost = 3;

  const validator = new MovementValidator(ship, 999, deployMove);
  const error = test.throws(() => validator.validate());
  test.is(error.message, "Requirements are not correct.");
});

test("Ship evasioncost has been tampered", test => {
  const ship = constructDeployedShip();
  const movementService = getMovementService();

  ship.evasioncost = 0;
  movementService.roll(ship);
  movementService.evade(ship, 1);
  movementService.pivot(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);
  ship.evasioncost = 3;

  const validator = new MovementValidator(ship, 999, deployMove);
  const error = test.throws(() => validator.validate());
  test.is(error.message, "Requirements are not correct.");
});

test("Destroyed thruster has been used", test => {
  const ship = constructDeployedShip();
  const movementService = getMovementService();

  movementService.roll(ship);
  movementService.evade(ship, 1);
  movementService.pivot(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);

  const thruster = ship.systems.getSystemById(4);
  thruster.addDamage(new DamageEntry(20));

  const validator = new MovementValidator(ship, 999, deployMove);
  const error = test.throws(() => validator.validate());
  test.is(error.message, "Thruster id '4' is disabled");
});

test("Thruster critical has been ignored", test => {
  const ship = constructDeployedShip();
  const movementService = getMovementService();

  movementService.roll(ship);
  movementService.evade(ship, 1);
  movementService.pivot(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);

  const thruster = ship.systems.getSystemById(4);
  thruster.addCritical(new OutputReduced(4));

  const validator = new MovementValidator(ship, 999, deployMove);
  const error = test.throws(() => validator.validate());
  test.is(error.message, "Thruster 4 can not channel 5");
});

test("Ship tries to teleport", test => {
  const ship = constructDeployedShip();
  const movementService = getMovementService();

  movementService.roll(ship);
  movementService.evade(ship, 1);
  movementService.pivot(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);

  ship.movement.moves[3].position = new hexagon.Offset(10, -4);

  const validator = new MovementValidator(ship, 999, deployMove);
  const error = test.throws(() => validator.validate());
  test.is(error.message, "Evade movement is constructed wrong");
});
