import { expect, test } from "vitest";
import { MovementService } from "../../../model/src/movement";
import GameController from "../../controller/GameController";
import { constructDeployedGame } from "../support/constructGame";
import TestDatabaseConnection from "../support/TestDatabaseConnection";
import { User } from "../../../model/src/User/User";
import GameData from "../../../model/src/game/GameData";

test("Test weapon heats up", async () => {
  const db = new TestDatabaseConnection("heat");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");
  let gameData = await constructDeployedGame(user, user2, controller);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);
  gameData = await controller.getGameData(gameData.getId(), user);

  let achilles = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!achilles) {
    throw new Error("Achilles not found");
  }
  let railgun = achilles.systems.getSystemById(101);

  expect(railgun.log.getMessagesForTurn(1)).toEqual([
    "Added 5 and cooled 5 units of heat.",
    "Current system heat was 0.",
  ]);

  expect(achilles.systems.getSystemById(205).log.getMessagesForTurn(1)).toEqual(
    [
      "Added 10 units of heat. Transfered 5 units of heat to radiators.",
      "Stored 5 units of heat.",
      "Radiated 5 units of heat.",
    ]
  );

  db.close();
});

test("Test manouvering thruster heats up", async () => {
  const db = new TestDatabaseConnection("heat");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");
  let gameData = await constructDeployedGame(user, user2, controller);

  let achilles = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const movementService = new MovementService().update(
    { turn: 1 } as unknown as GameData,
    { relayEvent: () => null }
  );

  if (!achilles) {
    throw new Error("Achilles not found");
  }

  movementService.pivot(achilles, 1);
  movementService.pivot(achilles, 1);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);
  gameData = await controller.getGameData(gameData.getId(), user);

  achilles = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!achilles) {
    throw new Error("Achilles not found");
  }

  let manouveringThruster = achilles.systems.getSystemById(10);

  expect(manouveringThruster.log.getMessagesForTurn(1)).toEqual([
    "Added 7.88 and cooled 5 units of heat.",
    "Current system heat was 2.88. Overheating 29%.",
  ]);

  db.close();
});
