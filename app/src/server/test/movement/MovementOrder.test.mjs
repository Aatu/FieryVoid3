import test from "ava";
import movementTypes from "../../model/movement/movementTypes";
import MovementOrder from "../../model/movement/MovementOrder";
import RequiredThrust from "../../model/movement/RequiredThrust";
import hexagon from "../../model/hexagon";
import Ship from "../../model/unit/Ship";

import Thruster from "../../model/unit/system/thruster/Thruster";
import Engine from "../../model/unit/system/engine/Engine";
import Reactor from "../../model/unit/system/reactor/Reactor";
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

const constructShip = (id = 123) => {
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
    -1,
    movementTypes.SPEED,
    new hexagon.Offset(0, 0),
    new hexagon.Offset(1, 0),
    2,
    false,
    999
  );

  const thruster = ship.systems.getSystemById(8);
  const requirement = new RequiredThrust(ship, move);
  requirement.fulfill(1, 2, thruster);

  move.setRequiredThrust(requirement);

  const move2 = new MovementOrder().deserialize(move.serialize());
  test.deepEqual(move, move2);
});
