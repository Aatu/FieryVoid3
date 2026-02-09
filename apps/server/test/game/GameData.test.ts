import { User } from "@fieryvoid3/model";
import Offset from "../../../model/src/hexagon/Offset";
import { MOVEMENT_TYPE } from "../../../model/src/movement";
import MovementOrder from "../../../model/src/movement/MovementOrder";
import { expect, test } from "vitest";
import GameData, { SerializedGameData } from "../../../model/src/game/GameData";
import { TestShip } from "../../../model/src/unit/ships/test";

const startMove = new MovementOrder(
  null,
  MOVEMENT_TYPE.START,
  new Offset(-32, 5),
  new Offset(3, 2),
  0,
  false,
  1
);

const deployMove = new MovementOrder(
  null,
  MOVEMENT_TYPE.DEPLOY,
  new Offset(0, 0),
  startMove.velocity,
  startMove.facing,
  startMove.rolled,
  1
);

const constructShip = (id: string = "123", user: User) => {
  let ship = new TestShip({ id });
  ship.player.setUser(user);
  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = (id: string, user: User) => {
  const ship = constructShip(id, user);
  ship.movement.addMovement(deployMove);
  return ship;
};

test("Get active ships for user", (test) => {
  const serverGame = new GameData({
    id: 123,
    turn: 1,
    phase: 1,
    activeShips: ["1", "3"],
  } as unknown as SerializedGameData);

  const user = new User({ id: 989, username: "Nönmän" });
  const user2 = new User({ id: 666, username: "Bädmän" });
  const ship = constructDeployedShip("1", user);
  const ship2 = constructDeployedShip("2", user);
  const ship3 = constructDeployedShip("3", user2);
  serverGame.ships.addShip(ship).addShip(ship2).addShip(ship3);

  expect(serverGame.getActiveShipsForUser(user)).toEqual([ship]);
  expect(serverGame.getActiveShipsForUser(user2)).toEqual([ship3]);
  expect(serverGame.getActiveShips()).toEqual([ship, ship3]);
});
