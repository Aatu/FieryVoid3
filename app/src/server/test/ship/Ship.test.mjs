import test from "ava";
import MovementService from "../../model/movement/MovementService";
import movementTypes from "../../model/movement/movementTypes";
import MovementOrder from "../../model/movement/MovementOrder";
import hexagon from "../../model/hexagon";
import TestShip from "../../model/unit/ships/test/TestShip";
import { createShipObject } from "../../model/unit/createShipObject";
import DamageEntry from "../../model/unit/system/DamageEntry";
import User from "../../model/User";

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
  startMove.velocity,
  startMove.facing,
  startMove.rolled,
  999
);

const getMovementService = () =>
  new MovementService().update({ turn: 999 }, { relayEvent: () => null });

const constructShip = (id = 123, user) => {
  let ship = new TestShip({ id: 123 });
  ship.player.setUser(user);
  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = (id, user) => {
  const ship = constructShip(id, user);
  ship.movement.addMovement(deployMove);
  return ship;
};

const compareMovements = (test, moves1, moves2) => {
  test.deepEqual(
    moves1.map((move) => move.clone().setRequiredThrust(null)),
    moves2.map((move) => move.clone().setRequiredThrust(null))
  );
};
