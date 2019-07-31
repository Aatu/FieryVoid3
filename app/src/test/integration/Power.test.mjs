import test from "ava";
import GameController from "../../server/controller/GameController.mjs";
import TestDatabaseConnection from "../support/TestDatabaseConnection.mjs";
import { constructDeployedGame } from "../support/constructGame.mjs";
import User from "../../model/User";

test.serial("Submit successfull power for both players", async test => {
  const db = new TestDatabaseConnection("power");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  const gameData = await constructDeployedGame(user, user2, controller);

  const achillesInitial = gameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  const biliyazInitial = gameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  achillesInitial.systems.getSystemById(5).power.setOffline();

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  const newGameData = await controller.getGameData(gameData.id, user);

  const achilles = newGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");
  test.true(achilles.systems.getSystemById(5).power.isOffline());

  await controller.commitTurn(gameData.id, gameData.serialize(), user2);

  const finalGameData = await controller.getGameData(gameData.id, user);

  const achilles2 = finalGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");
  test.true(achilles2.systems.getSystemById(5).power.isOffline());

  db.close();
});
