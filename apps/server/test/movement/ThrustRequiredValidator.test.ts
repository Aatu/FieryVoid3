import { expect, test } from "vitest";
import MovementOrder from "../../../model/src/movement/MovementOrder";
import Offset from "../../../model/src/hexagon/Offset";
import {
  MOVEMENT_TYPE,
  MovementService,
  RequiredThrust,
} from "../../../model/src/movement";
import GameData from "../../../model/src/game/GameData";
import Ship from "../../../model/src/unit/Ship";
import DamageEntry from "../../../model/src/unit/system/DamageEntry";
import { Engine } from "../../../model/src/unit/system/engine";
import { Reactor } from "../../../model/src/unit/system/reactor";
import {
  Thruster,
  ManeuveringThruster,
} from "../../../model/src/unit/system/thruster";
import RequiredThrustValidator from "../../services/validation/RequiredThrustValidator";
import { User } from "../../../model/src/User/User";

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
  new Offset(0, 0),
  startMove.position,
  startMove.facing,
  startMove.rolled,
  999
);

const constructShip = (
  id: string = "123",
  user: User = new User({ id: 1, username: "Kapteeni Klonkku" })
) => {
  let ship = new Ship({
    id,
  });
  ship.getPlayer().setUser(user);

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

export const constructDeployedShip = (
  id: string,
  user: User = new User({ id: 1, username: "Kapteeni Klonkkua" })
) => {
  const ship = constructShip(id, user);
  ship.movement.addMovement(deployMove);
  return ship;
};

test("Required thrust validates stuff", () => {
  const ship = constructDeployedShip("shippo");
  ship.accelcost = 10;
  const move = new MovementOrder(
    "1",
    MOVEMENT_TYPE.SPEED,
    new Offset(0, 0),
    new Offset(1, 0),
    0,
    false,
    999,
    0
  );

  const thruster1 = ship.systems.getSystemById(3);
  const thruster2 = ship.systems.getSystemById(4);

  let requiredThrust = new RequiredThrust().calculate(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  requiredThrust.fulfill(3, 5, thruster1);
  requiredThrust.fulfill(3, 5, thruster2);

  const validator = new RequiredThrustValidator(ship, move);
  expect(validator.validateRequirementsAreCorrect(requiredThrust)).toBe(true);
  expect(validator.getThrustChanneledBy(thruster1, requiredThrust)).toBe(5);
  expect(validator.getThrustChanneledBy(thruster2, requiredThrust)).toBe(5);
  expect(validator.isPaid(requiredThrust)).toBe(true);
  expect(validator.ensureThrustersAreValid(requiredThrust)).toBe(true);
});

test("Detect insufficient fulfilment", (test) => {
  const ship = constructDeployedShip("shippo");
  ship.accelcost = 10;
  const move = new MovementOrder(
    "1",
    MOVEMENT_TYPE.SPEED,
    new Offset(0, 0),
    new Offset(1, 0),
    0,
    false,
    999,
    0
  );

  const thruster1 = ship.systems.getSystemById(3);
  const thruster2 = ship.systems.getSystemById(4);

  let requiredThrust = new RequiredThrust().calculate(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  requiredThrust.fulfill(3, 5, thruster1);
  requiredThrust.fulfill(3, 4, thruster2);

  const validator = new RequiredThrustValidator(ship, move);
  expect(validator.validateRequirementsAreCorrect(requiredThrust)).toBe(true);
  expect(validator.getThrustChanneledBy(thruster1, requiredThrust)).toBe(5);
  expect(validator.getThrustChanneledBy(thruster2, requiredThrust)).toBe(4);

  expect(() => validator.isPaid(requiredThrust)).toThrowError(
    "Unpaid thrust: 1 for direction 3"
  );
});

test("Detect non existing thruster", (test) => {
  const ship = constructDeployedShip("shippo");
  ship.accelcost = 10;
  const move = new MovementOrder(
    "1",
    MOVEMENT_TYPE.SPEED,
    new Offset(0, 0),
    new Offset(1, 0),
    0,
    false,
    999,
    0
  );

  const thruster1 = ship.systems.getSystemById(3);
  const thruster2 = ship.systems.getSystemById(4);

  let requiredThrust = new RequiredThrust().calculate(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  requiredThrust.fulfill(3, 5, thruster1);
  requiredThrust.fulfill(
    3,
    5,
    new Thruster({ id: 87, hitpoints: 10, armor: 3 }, 5, 3)
  );

  const validator = new RequiredThrustValidator(ship, move);
  expect(validator.validateRequirementsAreCorrect(requiredThrust)).toBe(true);
  expect(validator.getThrustChanneledBy(thruster1, requiredThrust)).toBe(5);
  expect(validator.getThrustChanneledBy(thruster2, requiredThrust)).toBe(0);

  expect(() => validator.ensureThrustersAreValid(requiredThrust)).toThrowError(
    "Thruster id '87' not found"
  );
});

test("Detect destroyed thruster", (test) => {
  const ship = constructDeployedShip("Shippomus Maximus");
  ship.accelcost = 10;
  const move = new MovementOrder(
    "1",
    MOVEMENT_TYPE.SPEED,
    new Offset(0, 0),
    new Offset(1, 0),
    0,
    false,
    999,
    0
  );

  const thruster1 = ship.systems.getSystemById(3);
  const thruster2 = ship.systems.getSystemById(4);
  thruster2.addDamage(new DamageEntry(20));

  let requiredThrust = new RequiredThrust().calculate(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  requiredThrust.fulfill(3, 5, thruster1);
  requiredThrust.fulfill(3, 5, thruster2);

  const validator = new RequiredThrustValidator(ship, move);
  expect(validator.validateRequirementsAreCorrect(requiredThrust)).toBe(true);
  expect(validator.getThrustChanneledBy(thruster1, requiredThrust)).toBe(5);
  expect(validator.getThrustChanneledBy(thruster2, requiredThrust)).toBe(5);
  expect(validator.isPaid(requiredThrust)).toBe(true);

  expect(() => validator.ensureThrustersAreValid(requiredThrust)).toThrowError(
    "Thruster id '4' is disabled"
  );
});

test("Requirements are correct", (test) => {
  const ship = constructDeployedShip("Shipputus");
  ship.accelcost = 10;
  const move = new MovementOrder(
    "1",
    MOVEMENT_TYPE.SPEED,
    new Offset(0, 0),
    new Offset(1, 0),
    0,
    false,
    999,
    0
  );

  let requiredThrust = new RequiredThrust().calculate(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  const validator = new RequiredThrustValidator(ship, move);
  expect(validator.validateRequirementsAreCorrect(requiredThrust)).toBe(true);
});

test("Requirements are wrong", (test) => {
  const ship = constructDeployedShip("Shipputus");
  ship.accelcost = 10;
  const move = new MovementOrder(
    "1",
    MOVEMENT_TYPE.SPEED,
    new Offset(0, 0),
    new Offset(1, 0),
    0,
    false,
    999,
    0
  );

  let requiredThrust = new RequiredThrust().calculate(ship, move);
  requiredThrust.requirements[3] = 0;
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  const validator = new RequiredThrustValidator(ship, move);

  expect(() =>
    validator.validateRequirementsAreCorrect(requiredThrust)
  ).toThrowError("Requirements are not correct.");
});

test("Requirements are wrong (too much!)", () => {
  const ship = constructDeployedShip("Ship");
  ship.accelcost = 10;
  const move = new MovementOrder(
    "1",
    MOVEMENT_TYPE.SPEED,
    new Offset(0, 0),
    new Offset(1, 0),
    0,
    false,
    999,
    0
  );

  let requiredThrust = new RequiredThrust().calculate(ship, move);
  requiredThrust.requirements[4] = 5;
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  const validator = new RequiredThrustValidator(ship, move);

  expect(() =>
    validator.validateRequirementsAreCorrect(requiredThrust)
  ).toThrowError("Requirements are not correct.");
});

test("Wrong thruster", (test) => {
  const ship = constructDeployedShip("ship");
  ship.accelcost = 10;
  const move = new MovementOrder(
    "1",
    MOVEMENT_TYPE.SPEED,
    new Offset(0, 0),
    new Offset(1, 0),
    0,
    false,
    999,
    0
  );

  const thruster1 = ship.systems.getSystemById(3);
  const thruster2 = ship.systems.getSystemById(1);

  let requiredThrust = new RequiredThrust().calculate(ship, move);
  requiredThrust = new RequiredThrust().deserialize(requiredThrust.serialize());

  requiredThrust.fulfill(3, 5, thruster1);
  requiredThrust.fulfill(3, 5, thruster2);

  const validator = new RequiredThrustValidator(ship, move);
  expect(validator.validateRequirementsAreCorrect(requiredThrust)).toBe(true);
  expect(validator.getThrustChanneledBy(thruster1, requiredThrust)).toBe(5);
  expect(validator.getThrustChanneledBy(thruster2, requiredThrust)).toBe(5);
  expect(validator.isPaid(requiredThrust)).toBe(true);

  expect(() => validator.ensureThrustersAreValid(requiredThrust)).toThrowError(
    "Thruster id 1 is not direction 3"
  );
});
