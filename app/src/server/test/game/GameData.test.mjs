import test from "ava";
import GameData from "../../model/game/GameData";
import movementTypes from "../../model/movement/movementTypes";
import MovementOrder from "../../model/movement/MovementOrder";
import hexagon from "../../model/hexagon";
import TestShip from "../../model/unit/ships/test/TestShip";
import User from "../../model/User";

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

const constructShip = (id = 123, user) => {
  let ship = new TestShip({ id });
  ship.player.setUser(user);
  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = (id, user) => {
  const ship = constructShip(id, user);
  ship.movement.addMovement(deployMove);
  return ship;
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
