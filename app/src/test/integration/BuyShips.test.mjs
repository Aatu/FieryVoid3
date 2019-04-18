import test from "ava";
import GameController from "../../server/controller/GameController.mjs";
import TestDatabaseConnection from "../support/TestDatabaseConnection.mjs";
import User from "../../model/User";
import GameData from "../../model/game/GameData.mjs";
import GameSlot from "../../model/game/GameSlot.mjs";
import hexagon from "../../model/hexagon";
import { constructLobbyGameWithSlotsTaken } from "../support/constructGame.mjs";
import TestShip from "../../model/unit/ships/test/TestShip";

test.serial("Buy ships for first player", async test => {
  const db = new TestDatabaseConnection("buy_ships");
  await db.resetDatabase();
  const controller = new GameController(db);

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = await constructLobbyGameWithSlotsTaken(
    user,
    user2,
    controller
  );
  const slot1 = gameData.slots.getSlotById(0);

  await controller.buyShips(
    gameData.id,
    0,
    [
      new TestShip({ name: "UCS Achilles" }).serialize(),
      new TestShip({ name: "UCS Eclipse" }).serialize()
    ],
    user
  );

  const newGameData = await controller.getGameData(gameData.id);

  test.is(newGameData.ships.getShips().length, 2);
});
