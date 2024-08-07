import test from "ava";
import GameController from "../../server/controller/GameController.mjs";
import TestDatabaseConnection from "../support/TestDatabaseConnection.mjs";
import { constructDeployedGame } from "../support/constructGame.mjs";
import User from "../../model/User";
import Ammo140mmAP from "../../model/unit/system/weapon/ammunition/conventional/Ammo140mmAP.mjs";
import Ammo140mmHE from "../../model/unit/system/weapon/ammunition/conventional/Ammo140mmHE.mjs";

test.serial("Submit successfull power for both players", async (test) => {
  const db = new TestDatabaseConnection("power");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  const gameData = await constructDeployedGame(user, user2, controller);

  const achillesInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const biliyazInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  achillesInitial.systems.getSystemById(5).power.setOffline();

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  const newGameData = await controller.getGameData(gameData.id, user);

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");
  test.true(achilles.systems.getSystemById(5).power.isOffline());

  await controller.commitTurn(gameData.id, gameData.serialize(), user2);

  const finalGameData = await controller.getGameData(gameData.id, user);

  const achilles2 = finalGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");
  test.true(achilles2.systems.getSystemById(5).power.isOffline());

  db.close();
});

test.serial("Submit gamedata with boosted ew array", async (test) => {
  const db = new TestDatabaseConnection("power");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  const gameData = await constructDeployedGame(user, user2, controller);

  let achillesInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  test.is(achillesInitial.systems.getSystemById(11).callHandler("getBoost"), 0);

  achillesInitial.systems.getSystemById(5).power.setOffline();
  achillesInitial.systems.getSystemById(6).power.setOffline();

  //Note, this whole boosting of a weapon was to track down bug that required deboosts to be handled first
  achillesInitial.systems.getSystemById(101).callHandler("boost");
  test.is(
    achillesInitial.systems.getSystemById(101).callHandler("getBoost"),
    1
  );

  test.false(achillesInitial.systems.getSystemById(11).callHandler("canBoost"));

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  let newGameData = await controller.getGameData(gameData.id, user);

  achillesInitial = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");
  const biliyazInitial = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  achillesInitial.systems.getSystemById(101).callHandler("deBoost");
  test.true(achillesInitial.systems.getSystemById(11).callHandler("canBoost"));
  achillesInitial.systems.getSystemById(11).callHandler("boost");

  test.is(achillesInitial.systems.getSystemById(11).callHandler("getBoost"), 1);

  test.true(achillesInitial.systems.power.getRemainingPowerOutput() > 0);

  test.true(
    achillesInitial.electronicWarfare.canAssignOffensiveEw(biliyazInitial, 11)
  );

  achillesInitial.electronicWarfare.assignOffensiveEw(biliyazInitial, 11);

  await controller.commitTurn(gameData.id, newGameData.serialize(), user);
  newGameData = await controller.getGameData(gameData.id, user);

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const ewArray = achilles.systems.getSystemById(11);
  test.is(ewArray.callHandler("getBoost"), 1);

  await controller.commitTurn(gameData.id, newGameData.serialize(), user2);

  const finalGameData = await controller.getGameData(gameData.id, user);

  const achilles2 = finalGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");
  test.is(achilles2.systems.getSystemById(11).callHandler("getBoost"), 1);

  db.close();
});

test.serial("Test unloading of a weapon", async (test) => {
  const db = new TestDatabaseConnection("power");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(user, user2, controller);

  let achilles = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  let railgun = achilles.systems.getSystemById(101);

  let count = 10;
  while (count--) {
    railgun.callHandler("addToLoading", {
      object: new Ammo140mmAP(),
      amount: -1,
    });
  }

  railgun.power.setOffline();

  await controller.commitTurn(gameData.id, gameData.serialize(), user);

  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  gameData = await controller.getGameData(gameData.id, user);

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  gameData = await controller.getGameData(gameData.id, user);
  achilles = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  railgun = achilles.systems.getSystemById(101);

  test.deepEqual(railgun.callHandler("getAmmoInMagazine"), [
    { object: new Ammo140mmHE(), amount: 5 },
  ]);

  count = 10;
  while (count--) {
    railgun.callHandler("addToLoading", {
      object: new Ammo140mmHE(),
      amount: -1,
    });
  }

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  gameData = await controller.getGameData(gameData.id, user);

  achilles = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  railgun = achilles.systems.getSystemById(101);

  test.deepEqual(railgun.callHandler("getAmmoInMagazine"), [
    { object: new Ammo140mmHE(), amount: 1 },
  ]);

  db.close();
});
