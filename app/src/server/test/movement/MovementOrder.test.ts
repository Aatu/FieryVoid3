import { expect, test } from "vitest";
import MovementOrder from "../../../model/src/movement/MovementOrder";
import { MOVEMENT_TYPE, RequiredThrust } from "../../../model/src/movement";
import Offset from "../../../model/src/hexagon/Offset";
import Ship from "../../../model/src/unit/Ship";
import { Engine } from "../../../model/src/unit/system/engine";
import { Reactor } from "../../../model/src/unit/system/reactor";
import {
  Thruster,
  ManeuveringThruster,
} from "../../../model/src/unit/system/thruster";

const startMove = new MovementOrder(
  null,
  MOVEMENT_TYPE.START,
  new Offset(-32, 5),
  new Offset(3, 2),
  0,
  false,
  999
);

const constructShip = (id: string = "123") => {
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
    new ManeuveringThruster({ id: 10, hitpoints: 10, armor: 3 }, 6, 3),
    new Engine({ id: 5, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
  ]);

  ship.movement.addMovement(startMove);
  return ship;
};

test("MovementOrder serializes and deserializes nicely", (test) => {
  const ship = constructShip();

  const move = new MovementOrder(
    null,
    MOVEMENT_TYPE.SPEED,
    new Offset(0, 0),
    new Offset(1, 0),
    2,
    false,
    999
  );

  const thruster = ship.systems.getSystemById(8);
  const requirement = new RequiredThrust().calculate(ship, move);
  requirement.fulfill(1, 2, thruster);

  move.setRequiredThrust(requirement);

  const move2 = MovementOrder.fromData(move.serialize());
  expect(move).toEqual(move2);
});
