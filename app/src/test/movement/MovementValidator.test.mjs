/*
import test from "ava";
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
  new MovementService().update(
    { turn: 999 },
    { onShipMovementChanged: () => null }
  );

const constructShip = (id = 123) => {
  let ship = new Ship({
    id,
    accelcost: 3,
    rollcost: 3,
    pivotcost: 3,
    evasioncost: 3
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

test("Ship can be deployed", test => {
  const movementService = getMovementService();
  const ship = constructShip();

  const pos = new hexagon.Offset(10, 40);

  movementService.deploy(ship, pos);
  test.deepEqual(ship.movement.getMovement(), [
    startMove,
    new MovementOrder(
      -1,
      movementTypes.DEPLOY,
      pos,
      startMove.target,
      startMove.facing,
      startMove.rolled,
      999
    )
  ]);
  */
