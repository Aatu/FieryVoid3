import test from "ava";
import GameData from "../../model/game/GameData";
import MovementHandler from "../../server/handler/MovementHandler";
import GameController from "../../server/controller/GameController.mjs";
import TestDatabaseConnection from "../support/TestDatabaseConnection.mjs";
import { constructDeployedGame } from "../support/constructGame.mjs";
import MovementService from "../../model/movement/MovementService";
import WeaponFireService from "../../model/weapon/WeaponFireService";
import movementTypes from "../../model/movement/movementTypes";
import MovementOrder from "../../model/movement/MovementOrder";
import hexagon from "../../model/hexagon";
import TestShip from "../../model/unit/ships/test/TestShip";
import User from "../../model/User";
import FireOrder from "../../model/weapon/FireOrder.mjs";

test.serial("Submit successfull fire order for first player", async test => {
  const db = new TestDatabaseConnection("fire");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(user, user2, controller);
  await controller.commitTurn(gameData.id, gameData.serialize(), user2);

  const achillesInitial = gameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  const biliyazInitial = gameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  achillesInitial.electronicWarfare.assignOffensiveEw(biliyazInitial, 5);
  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  gameData = await controller.getGameData(gameData.id, user);

  const shooter = gameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  test.is(gameData.turn, 2);

  const fireService = new WeaponFireService().update(gameData);
  fireService.addFireOrder(shooter, target, shooter.systems.getSystemById(20));
  test.deepEqual(
    shooter.systems.getSystemById(20).callHandler("getFireOrders"),
    [new FireOrder(shooter, target, shooter.systems.getSystemById(20))]
  );

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  const newGameData = await controller.getGameData(gameData.id, user);

  const achilles = newGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  test.deepEqual(
    achilles.systems
      .getSystemById(20)
      .callHandler("getFireOrders")
      .map(order => order.setId(null)),
    [new FireOrder(shooter, target, shooter.systems.getSystemById(20))]
  );

  const opponentGameData = await controller.getGameData(gameData.id, user2);

  const opponent = opponentGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  test.deepEqual(
    opponent.systems.getSystemById(20).callHandler("getFireOrders"),
    []
  );

  db.close();
});

test.serial("Submit successfull fire order for both players", async test => {
  const db = new TestDatabaseConnection("fire");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(user, user2, controller);
  await controller.commitTurn(gameData.id, gameData.serialize(), user2);

  const achillesInitial = gameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  const biliyazInitial = gameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  achillesInitial.electronicWarfare.assignOffensiveEw(biliyazInitial, 5);
  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  gameData = await controller.getGameData(gameData.id, user);

  const shooter = gameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  test.is(gameData.turn, 2);

  const fireService = new WeaponFireService().update(gameData);
  fireService.addFireOrder(shooter, target, shooter.systems.getSystemById(20));
  test.deepEqual(
    shooter.systems.getSystemById(20).callHandler("getFireOrders"),
    [new FireOrder(shooter, target, shooter.systems.getSystemById(20))]
  );

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  const newGameData = await controller.getGameData(gameData.id, user);

  const biliyaz = newGameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  const achilles = newGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  test.is(biliyaz.systems.getSystemById(7).getRemainingHitpoints(), 10);

  test.false(achilles.systems.getSystemById(20).callHandler("isLoaded"));

  db.close();
});
