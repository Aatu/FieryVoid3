import test from "ava";
import GameController from "../../server/controller/GameController.mjs";
import TestDatabaseConnection from "../support/TestDatabaseConnection.mjs";
import { constructDeployedGame } from "../support/constructGame.mjs";
import User from "../../model/User";
import Ammo140mmAP from "../../model/unit/system/weapon/ammunition/conventional/Ammo140mmAP.mjs";
import Ammo140mmHE from "../../model/unit/system/weapon/ammunition/conventional/Ammo140mmHE.mjs";
import MovementService from "../../model/movement/MovementService.mjs";

test.serial("Test weapon heats up", async (test) => {
  const db = new TestDatabaseConnection("heat");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(user, user2, controller);

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  gameData = await controller.getGameData(gameData.id, user);

  let achilles = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  let railgun = achilles.systems.getSystemById(101);

  test.deepEqual(railgun.log.getMessagesForTurn(1), [
    "Added 5 and cooled 5 units of heat.",
    "Current system heat was 0.",
  ]);

  test.deepEqual(
    achilles.systems.getSystemById(205).log.getMessagesForTurn(1),
    [
      "Added 10 units of heat. Transfered 5 units of heat to radiators.",
      "Stored 5 units of heat.",
      "Radiated 5 units of heat.",
    ]
  );

  db.close();
});

test.serial("Test manouvering thruster heats up", async (test) => {
  const db = new TestDatabaseConnection("heat");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(user, user2, controller);

  let achilles = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const movementService = new MovementService().update(
    { turn: 1 },
    { relayEvent: () => null }
  );

  movementService.pivot(achilles, 1);
  movementService.pivot(achilles, 1);

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  gameData = await controller.getGameData(gameData.id, user);

  achilles = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  let manouveringThruster = achilles.systems.getSystemById(10);

  test.deepEqual(manouveringThruster.log.getMessagesForTurn(1), [
    "Added 7.88 and cooled 5 units of heat.",
    "Current system heat was 2.88. Overheating 29%.",
  ]);

  db.close();
});
