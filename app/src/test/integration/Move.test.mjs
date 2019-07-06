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

import {
  FirstThrustIgnored,
  EfficiencyHalved
} from "../../model/unit/system/criticals";

const startMove = new MovementOrder(
  -1,
  movementTypes.START,
  new hexagon.Offset(-32, 5),
  new hexagon.Offset(3, 2),
  0,
  false,
  1
);

const deployMove = new MovementOrder(
  -1,
  movementTypes.DEPLOY,
  new hexagon.Offset(5, -5),
  startMove.velocity,
  startMove.facing,
  startMove.rolled,
  1
);

const getMovementService = () =>
  new MovementService().update({ turn: 1 }, { relayEvent: () => null });

const constructShip = (id = 123, player) => {
  let ship = new TestShip({ id, player });
  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = (id, player) => {
  const ship = constructShip(id);
  ship.player.setUser(player);
  ship.movement.addMovement(deployMove);
  return ship;
};

const compareMovements = (test, moves1, moves2) => {
  test.deepEqual(
    moves1.map(move =>
      move
        .clone()
        .setRequiredThrust(null)
        .setId(null)
        .setIndex(0)
        .round()
    ),
    moves2.map(move =>
      move
        .clone()
        .setRequiredThrust(null)
        .setId(null)
        .setIndex(0)
        .round()
    )
  );
};

test.serial("Submit movement for first player, success", async test => {
  const db = new TestDatabaseConnection("movement");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = await constructDeployedGame(user, user2, controller);

  const movementService = getMovementService();

  const ship1 = gameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  movementService.thrust(ship1, 0);
  movementService.thrust(ship1, 0);
  movementService.thrust(ship1, 0);

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  const newGameData = await controller.getGameData(gameData.id, user);

  const achilles = newGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");
  const eclipse = newGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Eclipse");
  const biliyaz = newGameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  test.is(achilles.movement.getMovement().length, 5);
  test.is(eclipse.movement.getMovement().length, 2);
  test.is(biliyaz.movement.getMovement().length, 2);
  test.false(newGameData.isActiveShip(achilles));
  test.false(newGameData.isActiveShip(eclipse));
  test.true(newGameData.isActiveShip(biliyaz));
  test.false(newGameData.isPlayerActive(user));
  test.true(newGameData.isPlayerActive(user2));

  const newGameData2 = await controller.getGameData(gameData.id, user2);
  const achilles2 = newGameData2.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");
  test.is(achilles2.movement.getMovement().length, 2);

  db.close();
});

test.serial("Submit movement for both players, success", async test => {
  const db = new TestDatabaseConnection("movement");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = await constructDeployedGame(user, user2, controller);

  const movementService = getMovementService();

  const achillesInitial = gameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  const eclipseInitial = gameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Eclipse");

  const biliyazInitial = gameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);

  movementService.thrust(biliyazInitial, 3);
  movementService.thrust(biliyazInitial, 3);
  movementService.thrust(biliyazInitial, 3);

  //console.log(ship1.movement.getMovement());

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  const newGameData = await controller.getGameData(gameData.id);

  const achilles = newGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");
  const eclipse = newGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Eclipse");
  const biliyaz = newGameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  test.is(achilles.movement.getMovement().length, 1);
  test.is(eclipse.movement.getMovement().length, 1);
  test.is(biliyaz.movement.getMovement().length, 1);
  test.is(newGameData.turn, 2);
  test.true(newGameData.isActiveShip(achilles));
  test.true(newGameData.isActiveShip(eclipse));
  test.true(newGameData.isActiveShip(biliyaz));
  test.true(newGameData.isPlayerActive(user));
  test.true(newGameData.isPlayerActive(user2));

  compareMovements(test, eclipse.movement.getMovement(), [
    new MovementOrder(
      null,
      movementTypes.END,
      new hexagon.Offset(-4, 3),
      new hexagon.Offset(30, 0),
      0,
      false,
      2
    )
  ]);

  compareMovements(test, achilles.movement.getMovement(), [
    new MovementOrder(
      null,
      movementTypes.END,
      new hexagon.Offset(1, 3),
      new hexagon.Offset(33, 0),
      0,
      false,
      2
    )
  ]);

  compareMovements(test, biliyaz.movement.getMovement(), [
    new MovementOrder(
      null,
      movementTypes.END,
      new hexagon.Offset(1, 0),
      new hexagon.Offset(-33, 0),
      0,
      false,
      2
    )
  ]);

  db.close();
});
