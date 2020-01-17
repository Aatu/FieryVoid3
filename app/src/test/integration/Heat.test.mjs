import test from "ava";
import GameController from "../../server/controller/GameController.mjs";
import TestDatabaseConnection from "../support/TestDatabaseConnection.mjs";
import { constructDeployedGame } from "../support/constructGame.mjs";
import User from "../../model/User";
import Ammo140mmAP from "../../model/unit/system/weapon/ammunition/conventional/Ammo140mmAP.mjs";
import Ammo140mmHE from "../../model/unit/system/weapon/ammunition/conventional/Ammo140mmHE.mjs";

test.serial("Test weapon heats up", async test => {
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
    .find(ship => ship.name === "UCS Achilles");

  let railgun = achilles.systems.getSystemById(101);

  test.deepEqual(railgun.log.getMessagesForTurn(1), [
    "Generated 5 and cooled 5 units of heat.",
    "Current system heat is 0."
  ]);

  test.deepEqual(
    achilles.systems.getSystemById(205).log.getMessagesForTurn(1),
    [
      "Added 10 units of heat. Transfered 5 units of heat to radiators.",
      "Currently storing 5 units of heat.",
      "Radiated 5 units of heat."
    ]
  );

  db.close();
});
