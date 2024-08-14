import { expect, test } from "vitest";
import { User } from "../../../model/src/User/User";
import { USER_AI } from "../../../model/src/User/AIUser";
import GameController from "../../controller/GameController";
import { Offset } from "../../../model/src/hexagon";
import { constructDeployedGame } from "../support/constructGame";
import TestDatabaseConnection from "../support/TestDatabaseConnection";

test("Ai ship targets enemy", async () => {
  const db = new TestDatabaseConnection("ai");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = User.create(1, "Nönmän");
  const user2 = USER_AI;
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(40, 0)
  );
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  gameData = await controller.getGameData(gameData.getId(), user);

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  expect(gameData.turn).toBe(2);

  let someEWAssigned = false;

  gameData.ships.getShips().forEach((ship) => {
    if (ship.electronicWarfare.inEffect.entries.length > 0) {
      someEWAssigned = true;
    }
  });

  expect(someEWAssigned).toBe(true);
  db.close();
});
