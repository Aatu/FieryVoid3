import { expect, test } from "vitest";
import TestDatabaseConnection from "../support/TestDatabaseConnection";
import { User } from "../../../model/src/User/User";
import GameController from "../../controller/GameController";
import { constructDeployedGame } from "../support/constructGame";

test("Submit successfull electronic warfare for first player", async () => {
  const db = new TestDatabaseConnection("electronicWarfare");
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
    throw new Error("Ships not found");
  }

  achillesInitial.electronicWarfare.assignOffensiveEw(biliyazInitial, 5);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  const newGameData = await controller.getGameData(gameData.getId(), user);

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");
  const biliyaz = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!achilles || !biliyaz) {
    throw new Error("Ships not found");
  }

  expect(achilles.electronicWarfare.getOffensiveEw(biliyaz)).toBe(5);

  db.close();
});

test("Submit successfull electronic warfare for both players", async () => {
  const db = new TestDatabaseConnection("electronicWarfare");
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
    throw new Error("Ships not found");
  }

  biliyazInitial.electronicWarfare.assignCcEw(3);
  achillesInitial.electronicWarfare.assignOffensiveEw(biliyazInitial, 5);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);
  const newGameData = await controller.getGameData(gameData.getId(), user);

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");
  const biliyaz = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!achilles || !biliyaz) {
    throw new Error("Ships not found");
  }

  expect(newGameData.turn).toEqual(2);
  expect(achilles.electronicWarfare.getOffensiveEw(biliyaz)).toEqual(0);
  expect(achilles.electronicWarfare.inEffect.getOffensiveEw(biliyaz)).toEqual(
    5
  );
  expect(biliyaz.electronicWarfare.getCcEw()).toEqual(0); //this is censored
  expect(biliyaz.electronicWarfare.inEffect.getCcEw()).toEqual(3);

  db.close();
});
