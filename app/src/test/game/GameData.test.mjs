import test from "ava";
import GameData from "../../model/game/GameData";
import MovementHandler from "../../server/handler/MovementHandler";
import MovementValidator from "../../server/services/validation/MovementValidator";
import MovementService from "../../model/movement/MovementService";
import movementTypes from "../../model/movement/movementTypes";
import MovementOrder from "../../model/movement/MovementOrder";
import hexagon from "../../model/hexagon";
import TestShip from "../../model/unit/ships/test/TestShip";
import User from "../../model/User";

import {
  FirstThrustIgnored,
  EfficiencyHalved
} from "../../model/unit/system/criticals";

const startMove = new MovementOrder(
  -1,
  movementTypes.START,
  new hexagon.Offset(-32, 5),
  new hexagon.Offset(3, 2),
  0,
  false,
  1
);

const deployMove = new MovementOrder(
  -1,
  movementTypes.DEPLOY,
  new hexagon.Offset(0, 0),
  startMove.target,
  startMove.facing,
  startMove.rolled,
  1
);

const getMovementService = () =>
  new MovementService().update(
    { turn: 1 },
    { onShipMovementChanged: () => null }
  );

const constructShip = (id = 123, user) => {
  let ship = new TestShip({ id, player: user });
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
    moves1.map(move => move.clone().setRequiredThrust(null)),
    moves2.map(move => move.clone().setRequiredThrust(null))
  );
};

test("Get active ships for user", test => {
  const serverGame = new GameData({
    id: 123,
    turn: 1,
    phase: 1,
    activeShips: [1, 3]
  });

  const user = new User(989, "Nönmän");
  const user2 = new User(666, "Bädmän");
  const ship = constructDeployedShip(1, user);
  const ship2 = constructDeployedShip(2, user);
  const ship3 = constructDeployedShip(3, user2);
  serverGame.ships
    .addShip(ship)
    .addShip(ship2)
    .addShip(ship3);

  test.deepEqual(serverGame.getActiveShipsForUser(user), [ship]);
  test.deepEqual(serverGame.getActiveShipsForUser(user2), [ship3]);
  test.deepEqual(serverGame.getActiveShips(), [ship, ship3]);
});
