import { expect, test } from "vitest";
import MovementOrder from "../../../model/src/movement/MovementOrder";
import {
  MOVEMENT_TYPE,
  MovementService,
  RequiredThrust,
} from "../../../model/src/movement";
import Offset from "../../../model/src/hexagon/Offset";
import GameData from "../../../model/src/game/GameData";
import Ship from "../../../model/src/unit/Ship";
import FuelTank from "../../../model/src/unit/system/cargo/FuelTank";
import { OutputReduced } from "../../../model/src/unit/system/criticals";
import DamageEntry from "../../../model/src/unit/system/DamageEntry";
import { Engine } from "../../../model/src/unit/system/engine";
import { Reactor } from "../../../model/src/unit/system/reactor";
import {
  Thruster,
  ManeuveringThruster,
} from "../../../model/src/unit/system/thruster";
import MovementValidator from "../../services/validation/MovementValidator";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";

const startMove = new MovementOrder(
  "-1",
  MOVEMENT_TYPE.START,
  new Offset(-32, 5),
  new Offset(3, 2),
  0,
  false,
  999
);

const deployMove = new MovementOrder(
  "-1",
  MOVEMENT_TYPE.DEPLOY,
  new Offset(3, 2),
  startMove.velocity,
  startMove.facing,
  startMove.rolled,
  999
);

const getMovementService = () =>
  new MovementService().update({ turn: 999 } as unknown as GameData, {
    relayEvent: () => null,
  });

const constructShip = (id = "123") => {
  let ship = new Ship({
    id,
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
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new FuelTank({ id: 12, hitpoints: 10, armor: 3 }, 400),
  ]);

  ship.systems
    .getSystemById(12)
    .callHandler(SYSTEM_HANDLERS.setMaxFuel, undefined, undefined);

  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = (id?: string) => {
  const ship = constructShip(id);
  ship.movement.addMovement(deployMove);
  return ship;
};

const compareMovements = (moves1: MovementOrder[], moves2: MovementOrder[]) => {
  expect(
    moves1.map((move) =>
      move.clone().setRequiredThrust(null as unknown as RequiredThrust)
    )
  ).toEqual(
    moves2.map((move) =>
      move.clone().setRequiredThrust(null as unknown as RequiredThrust)
    )
  );
};

test("Valid movement", (test) => {
  const ship = constructDeployedShip();
  const movementService = getMovementService();

  movementService.roll(ship);
  movementService.evade(ship, 1);
  movementService.pivot(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);
  movementService.thrust(ship, 1);

  const validator = new MovementValidator(ship, 999, deployMove);
  expect(validator.validate()).toBe(true);
});

/*
test("Ship accelcost has been tampered", (test) => {
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

test("Ship tries to move without fuel", (test) => {
  const ship = constructDeployedShip();
  const movementService = getMovementService();

  ship.accelcost = 1;
  movementService.thrust(ship, 1);
  ship.systems.getSystemById(12).callHandler("setFuel", 0);

  const validator = new MovementValidator(ship, 999, deployMove);
  const error = test.throws(() => validator.validate());
  test.is(error.message, "Unable to pay fuel 1. Ship has fuel 0.");
});

test("Ship pivotcost has been tampered", (test) => {
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

test("Ship rollcost has been tampered", (test) => {
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

test("Ship evasioncost has been tampered", (test) => {
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

test("Destroyed thruster has been used", (test) => {
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

test("Thruster critical has been ignored", (test) => {
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

test("Ship tries to teleport", (test) => {
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

test("Ship pivots more than its limitation", (test) => {
  const ship = constructDeployedShip();
  const movementService = getMovementService();

  movementService.roll(ship);
  movementService.pivot(ship, 1);
  movementService.pivot(ship, 1);

  ship.maxPivots = 1;

  const validator = new MovementValidator(ship, 999, deployMove);
  const error = test.throws(() => validator.validate());
  test.is(error.message, "Ship has pivoted more than allowed");
});
*/
