import { expect, test } from "vitest";
import TestDatabaseConnection from "../support/TestDatabaseConnection";

import GameController from "../../controller/GameController";
import { constructDeployedGame } from "../support/constructGame";
import { User } from "../../../model/src/User/User";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import Ammo140mmAP from "../../../model/src/unit/system/weapon/ammunition/conventional/Ammo140mmAP";
import Ammo140mmHE from "../../../model/src/unit/system/weapon/ammunition/conventional/Ammo140mmHE";
import Ammo from "../../../model/src/unit/system/weapon/ammunition/Ammo";

test("Submit successfull power for both players", async () => {
  const db = new TestDatabaseConnection("power1");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");
  const gameData = await constructDeployedGame(user, user2, controller);

  const achillesInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const biliyazInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!achillesInitial || !biliyazInitial) {
    throw new Error("Could not find ships");
  }

  achillesInitial.systems.getSystemById(5).power.setOffline();

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  const newGameData = await controller.getGameData(gameData.getId(), user);

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!achilles) {
    throw new Error("Could not find ship");
  }

  expect(achilles.systems.getSystemById(5).power.isOffline()).toBe(true);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);

  const finalGameData = await controller.getGameData(gameData.getId(), user);

  const achilles2 = finalGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!achilles2) {
    throw new Error("Could not find ship");
  }

  expect(achilles2.systems.getSystemById(5).power.isOffline()).toBe(true);

  db.close();
});

test("Submit gamedata with boosted ew array", async () => {
  const db = new TestDatabaseConnection("power_boosted_array");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");
  const gameData = await constructDeployedGame(user, user2, controller);

  let achillesInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!achillesInitial) {
    throw new Error("Could not find ship");
  }

  expect(achillesInitial.systems.getSystemById(11).handlers.getBoost()).toBe(0);

  achillesInitial.systems.getSystemById(5).power.setOffline();
  achillesInitial.systems.getSystemById(6).power.setOffline();

  //Note, this whole boosting of a weapon was to track down bug that required deboosts to be handled first
  achillesInitial.systems.getSystemById(101).handlers.boost();

  expect(achillesInitial.systems.getSystemById(101).handlers.getBoost()).toBe(
    1
  );

  expect(achillesInitial.systems.getSystemById(11).handlers.canBoost()).toBe(
    false
  );

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);

  let newGameData = await controller.getGameData(gameData.getId(), user);

  achillesInitial = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");
  const biliyazInitial = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!achillesInitial || !biliyazInitial) {
    throw new Error("Could not find ships");
  }

  achillesInitial.systems.getSystemById(101).handlers.deBoost();
  expect(achillesInitial.systems.getSystemById(11).handlers.canBoost()).toBe(
    true
  );
  achillesInitial.systems.getSystemById(11).handlers.boost();

  expect(achillesInitial.systems.getSystemById(11).handlers.getBoost()).toBe(1);

  expect(achillesInitial.systems.power.getRemainingPowerOutput() > 0).toBe(
    true
  );

  expect(
    achillesInitial.electronicWarfare.canAssignOffensiveEw(biliyazInitial, 11)
  ).toBe(true);

  achillesInitial.electronicWarfare.assignOffensiveEw(biliyazInitial, 11);

  await controller.commitTurn(gameData.getId(), newGameData.serialize(), user);
  newGameData = await controller.getGameData(gameData.getId(), user);

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!achilles) {
    throw new Error("Could not find ship");
  }

  const ewArray = achilles.systems.getSystemById(11);
  expect(ewArray.handlers.getBoost()).toBe(1);

  await controller.commitTurn(gameData.getId(), newGameData.serialize(), user2);

  const finalGameData = await controller.getGameData(gameData.getId(), user);

  const achilles2 = finalGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!achilles2) {
    throw new Error("Could not find ship");
  }

  expect(achilles2.systems.getSystemById(11).handlers.getBoost()).toBe(1);

  db.close();
});
