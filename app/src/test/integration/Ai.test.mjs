import test from "ava";
import GameController from "../../server/controller/GameController.mjs";
import TestDatabaseConnection from "../support/TestDatabaseConnection.mjs";
import { constructDeployedGame } from "../support/constructGame.mjs";
import User from "../../model/User";
import { USER_AI } from "../../model/AIUser.mjs";
import Offset from "../../model/hexagon/Offset.mjs";

test.serial("Ai ship targets enemy", async (test) => {
  const db = new TestDatabaseConnection("ai");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = USER_AI;
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(40, 0)
  );
  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  gameData = await controller.getGameData(gameData.id, user);

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  test.is(gameData.turn, 2);

  let someEWAssigned = false;

  gameData.ships.getShips().forEach((ship) => {
    if (ship.electronicWarfare.inEffect.entries.length > 0) {
      someEWAssigned = true;
    }
  });

  test.true(someEWAssigned);
  db.close();
});
