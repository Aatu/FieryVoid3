import test from "ava";
import GameData from "../../model/game/GameData";
import MovementHandler from "../../server/handler/MovementHandler";
import GameController from "../../server/controller/GameController.mjs";
import TestDatabaseConnection from "../support/TestDatabaseConnection.mjs";
import { constructDeployedGame } from "../support/constructGame.mjs";
import MovementService from "../../model/movement/MovementService";
import movementTypes from "../../model/movement/movementTypes";
import MovementOrder from "../../model/movement/MovementOrder";
import hexagon from "../../model/hexagon";
import TestShip from "../../model/unit/ships/test/TestShip";
import User from "../../model/User";

test.serial(
  "Submit successfull electronic warfare for first player",
  async test => {
    const db = new TestDatabaseConnection("electronicWarfare");
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

    achillesInitial.electronicWarfare.assignOffensiveEw(biliyazInitial, 5);

    await controller.commitTurn(gameData.id, gameData.serialize(), user);
    const newGameData = await controller.getGameData(gameData.id, user);

    const achilles = newGameData.ships
      .getShips()
      .find(ship => ship.name === "UCS Achilles");
    const biliyaz = newGameData.ships
      .getShips()
      .find(ship => ship.name === "GEPS Biliyaz");

    test.is(achilles.electronicWarfare.getOffensiveEw(biliyaz), 5);

    db.close();
  }
);
