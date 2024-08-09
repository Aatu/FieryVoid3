import test from "ava";
import MovementService from "../../model/movement/MovementService";
import movementTypes from "../../model/movement/movementTypes";
import MovementOrder from "../../model/movement/MovementOrder";
import RequiredThrust from "../../model/movement/RequiredThrust";
import RequiredThrustValidator from "../../server/services/validation/RequiredThrustValidator";
import hexagon from "../../model/hexagon";
import Ship from "../../model/unit/Ship";

import Thruster from "../../model/unit/system/thruster/Thruster";
import Engine from "../../model/unit/system/engine/Engine";
import Reactor from "../../model/unit/system/reactor/Reactor";
import DamageEntry from "../../model/unit/system/DamageEntry";
import ManeuveringThruster from "../../model/unit/system/thruster/ManeuveringThruster";

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
  new hexagon.Offset(0, 0),
  startMove.target,
  startMove.facing,
  startMove.rolled,
  999
);

const getMovementService = () =>
  new MovementService().update({ turn: 999 }, { relayEvent: () => null });

const constructShip = (id = 123) => {
  let ship = new Ship({
    id,
    accelcost: 3,
    rollcost: 3,
    pivotcost: 3,
    evasioncost: 3,
  });
  ship.systems.addPrimarySystem([
    new Thruster({ id: 1, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 2, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 8, hitpoints: 10, armor: 3 }, 5, [1, 2]),
    new Thruster({ id: 9, hitpoints: 10, armor: 3 }, 5, [4, 5]),
    new Thruster({ id: 3, hitpoints: 10, armor: 3 }, 5, 3),
    new Thruster({ id: 4, hitpoints: 10, armor: 3 }, 5, 3),
    new ManeuveringThruster({ id: 10, hitpoints: 10, armor: 3 }, 6, 3),
    new Engine({ id: 5, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
  ]);

  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = (id) => {
  const ship = constructShip(id);
  ship.movement.addMovement(deployMove);
  return ship;
};

const compareMovements = (test, moves1, moves2) => {
  test.deepEqual(
    moves1.map((move) => move.clone().setRequiredThrust(null)),
    moves2.map((move) => move.clone().setRequiredThrust(null))
  );
};

test("Required thrust validates stuff", (test) => {
  const ship = constructDeployedShip();
  ship.accelcost = 10;
  const move = new MovementOrder(
    1,
    movementTypes.SPEED,
    new hexagon.Offset(0, 0),
    new hexagon.Offset(1, 0),
    0,
    false,
    999,
    0
  );

  const thruster1 = ship.systems.getSystemById(3);
  const thruster2 = ship.systems.getSystemById(4);

  let requiredThrust = new RequiredThrust(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  requiredThrust.fulfill(3, 5, thruster1);
  requiredThrust.fulfill(3, 5, thruster2);

  const validator = new RequiredThrustValidator(ship, move);
  test.true(validator.validateRequirementsAreCorrect(requiredThrust));
  test.is(validator.getThrustChanneledBy(thruster1, requiredThrust), 5);
  test.is(validator.getThrustChanneledBy(thruster2, requiredThrust), 5);
  test.true(validator.isPaid(requiredThrust));
  test.true(validator.ensureThrustersAreValid(requiredThrust));
});

test("Detect insufficient fulfilment", (test) => {
  const ship = constructDeployedShip();
  ship.accelcost = 10;
  const move = new MovementOrder(
    1,
    movementTypes.SPEED,
    new hexagon.Offset(0, 0),
    new hexagon.Offset(1, 0),
    0,
    false,
    999,
    0
  );

  const thruster1 = ship.systems.getSystemById(3);
  const thruster2 = ship.systems.getSystemById(4);

  let requiredThrust = new RequiredThrust(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  requiredThrust.fulfill(3, 5, thruster1);
  requiredThrust.fulfill(3, 4, thruster2);

  const validator = new RequiredThrustValidator(ship, move);
  test.true(validator.validateRequirementsAreCorrect(requiredThrust));
  test.is(validator.getThrustChanneledBy(thruster1, requiredThrust), 5);
  test.is(validator.getThrustChanneledBy(thruster2, requiredThrust), 4);
  const error = test.throws(() => validator.isPaid(requiredThrust));
  test.is(error.message, "Unpaid thrust: 1 for direction 3");
});

test("Detect non existing thruster", (test) => {
  const ship = constructDeployedShip();
  ship.accelcost = 10;
  const move = new MovementOrder(
    1,
    movementTypes.SPEED,
    new hexagon.Offset(0, 0),
    new hexagon.Offset(1, 0),
    0,
    false,
    999,
    0
  );

  const thruster1 = ship.systems.getSystemById(3);
  const thruster2 = ship.systems.getSystemById(4);

  let requiredThrust = new RequiredThrust(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  requiredThrust.fulfill(3, 5, thruster1);
  requiredThrust.fulfill(
    3,
    5,
    new Thruster({ id: 87, hitpoints: 10, armor: 3 }, 5, 3)
  );

  const validator = new RequiredThrustValidator(ship, move);
  test.true(validator.validateRequirementsAreCorrect(requiredThrust));
  test.is(validator.getThrustChanneledBy(thruster1, requiredThrust), 5);
  test.is(validator.getThrustChanneledBy(thruster2, requiredThrust), 0);
  const error = test.throws(() =>
    validator.ensureThrustersAreValid(requiredThrust)
  );
  test.is(error.message, "Thruster id '87' not found");
});

test("Detect destroyed thruster", (test) => {
  const ship = constructDeployedShip();
  ship.accelcost = 10;
  const move = new MovementOrder(
    1,
    movementTypes.SPEED,
    new hexagon.Offset(0, 0),
    new hexagon.Offset(1, 0),
    0,
    false,
    999,
    0
  );

  const thruster1 = ship.systems.getSystemById(3);
  const thruster2 = ship.systems.getSystemById(4);
  thruster2.addDamage(new DamageEntry(20));

  let requiredThrust = new RequiredThrust(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  requiredThrust.fulfill(3, 5, thruster1);
  requiredThrust.fulfill(3, 5, thruster2);

  const validator = new RequiredThrustValidator(ship, move);
  test.true(validator.validateRequirementsAreCorrect(requiredThrust));
  test.is(validator.getThrustChanneledBy(thruster1, requiredThrust), 5);
  test.is(validator.getThrustChanneledBy(thruster2, requiredThrust), 5);
  test.true(validator.isPaid(requiredThrust));
  const error = test.throws(() =>
    validator.ensureThrustersAreValid(requiredThrust)
  );
  test.is(error.message, "Thruster id '4' is disabled");
});

test("Requirements are correct", (test) => {
  const ship = constructDeployedShip();
  ship.accelcost = 10;
  const move = new MovementOrder(
    1,
    movementTypes.SPEED,
    new hexagon.Offset(0, 0),
    new hexagon.Offset(1, 0),
    0,
    false,
    999,
    0
  );

  let requiredThrust = new RequiredThrust(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  const validator = new RequiredThrustValidator(ship, move);
  test.true(validator.validateRequirementsAreCorrect(requiredThrust));
});

test("Requirements are wrong", (test) => {
  const ship = constructDeployedShip();
  ship.accelcost = 10;
  const move = new MovementOrder(
    1,
    movementTypes.SPEED,
    new hexagon.Offset(0, 0),
    new hexagon.Offset(1, 0),
    0,
    false,
    999,
    0
  );

  let requiredThrust = new RequiredThrust(ship, move);
  requiredThrust.requirements[3] = 0;
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  const validator = new RequiredThrustValidator(ship, move);

  const error = test.throws(() =>
    validator.validateRequirementsAreCorrect(requiredThrust)
  );
  test.is(error.message, "Requirements are not correct.");
});

test("Requirements are wrong (too much!)", (test) => {
  const ship = constructDeployedShip();
  ship.accelcost = 10;
  const move = new MovementOrder(
    1,
    movementTypes.SPEED,
    new hexagon.Offset(0, 0),
    new hexagon.Offset(1, 0),
    0,
    false,
    999,
    0
  );

  let requiredThrust = new RequiredThrust(ship, move);
  requiredThrust.requirements[4] = 5;
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  const validator = new RequiredThrustValidator(ship, move);
  const error = test.throws(() =>
    validator.validateRequirementsAreCorrect(requiredThrust)
  );
  test.is(error.message, "Requirements are not correct.");
});

test("Wrong thruster", (test) => {
  const ship = constructDeployedShip();
  ship.accelcost = 10;
  const move = new MovementOrder(
    1,
    movementTypes.SPEED,
    new hexagon.Offset(0, 0),
    new hexagon.Offset(1, 0),
    0,
    false,
    999,
    0
  );

  const thruster1 = ship.systems.getSystemById(3);
  const thruster2 = ship.systems.getSystemById(1);

  let requiredThrust = new RequiredThrust(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  requiredThrust.fulfill(3, 5, thruster1);
  requiredThrust.fulfill(3, 5, thruster2);

  const validator = new RequiredThrustValidator(ship, move);
  test.true(validator.validateRequirementsAreCorrect(requiredThrust));
  test.is(validator.getThrustChanneledBy(thruster1, requiredThrust), 5);
  test.is(validator.getThrustChanneledBy(thruster2, requiredThrust), 5);
  test.true(validator.isPaid(requiredThrust));
  const error = test.throws(() =>
    validator.ensureThrustersAreValid(requiredThrust)
  );
  test.is(error.message, "Thruster id 1 is not direction 3. Instead is 0");
});
