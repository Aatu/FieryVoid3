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

test.serial("Submit gamedata with boosted ew array", async test => {
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

  test.is(achillesInitial.systems.getSystemById(11).callHandler("getBoost"), 0);

  achillesInitial.systems.getSystemById(5).power.setOffline();
  achillesInitial.systems.getSystemById(6).power.setOffline();

  achillesInitial.systems.getSystemById(11).callHandler("boost");
  test.is(achillesInitial.systems.getSystemById(11).callHandler("getBoost"), 1);
  achillesInitial.electronicWarfare.assignOffensiveEw(biliyazInitial, 11);

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  const newGameData = await controller.getGameData(gameData.id, user);

  const achilles = newGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  const ewArray = achilles.systems.getSystemById(11);
  test.is(ewArray.callHandler("getBoost"), 1);

  await controller.commitTurn(gameData.id, gameData.serialize(), user2);

  const finalGameData = await controller.getGameData(gameData.id, user);

  const achilles2 = finalGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");
  test.is(achilles2.systems.getSystemById(11).callHandler("getBoost"), 1);

  db.close();
});
