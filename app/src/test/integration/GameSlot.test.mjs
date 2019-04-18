import test from "ava";
import GameController from "../../server/controller/GameController.mjs";
import TestDatabaseConnection from "../support/TestDatabaseConnection.mjs";
import User from "../../model/User";
import GameData from "../../model/game/GameData.mjs";
import GameSlot from "../../model/game/GameSlot.mjs";
import hexagon from "../../model/hexagon";
import { constructLobbyGame } from "../support/constructGame.mjs";

test.serial("Take slot", async test => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData, user);

  await controller.takeSlot(gameId, 1, user2);

  const newGameData = await controller.getGameData(gameId);
  test.is(newGameData.slots.getSlotById(1).userId, user2.id);
});
