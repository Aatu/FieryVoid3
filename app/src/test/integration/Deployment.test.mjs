import test from "ava";
import GameData from "../../model/game/GameData";
import MovementHandler from "../../server/handler/MovementHandler";
import GameController from "../../server/controller/GameController.mjs";
import TestDatabaseConnection from "../support/TestDatabaseConnection.mjs";
import { constructShipsBoughtGame } from "../support/constructGame.mjs";
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
        .round()
    ),
    moves2.map(move =>
      move
        .clone()
        .setRequiredThrust(null)
        .round()
    )
  );
};

test.serial(
  "Submit deployment, but ship is missing deploy move",
  async test => {
    const db = new TestDatabaseConnection("deployment");
    await db.resetDatabase();

    const controller = new GameController(db);

    const user = new User(1, "Nönmän");
    const user2 = new User(2, "Bädmän");

    const gameData = await constructShipsBoughtGame(user, user2, controller);

    const movementService = getMovementService();
    movementService.deploy(
      gameData.ships.getShips().find(ship => ship.name === "UCS Achilles"),
      new hexagon.Offset(-32, 3)
    );

    const undeployedShip = gameData.ships
      .getShips()
      .find(ship => ship.name === "UCS Eclipse");
    undeployedShip.movement.moves = undeployedShip.movement.moves.filter(
      move => !move.isDeploy()
    );

    const error = await test.throwsAsync(() =>
      controller.commitDeployment(gameData.id, gameData.serialize(), user)
    );

    test.is(
      error.message,
      "Invalid deployment for ship UCS Eclipse: deployment missing"
    );
    db.close();
  }
);

test.serial(
  "Submit deployment with invalid deployment position",
  async test => {
    const db = new TestDatabaseConnection("deployment");
    await db.resetDatabase();

    const controller = new GameController(db);

    const user = new User(1, "Nönmän");
    const user2 = new User(2, "Bädmän");

    const gameData = await constructShipsBoughtGame(user, user2, controller);

    const movementService = getMovementService();
    movementService.deploy(
      gameData.ships.getShips().find(ship => ship.name === "UCS Achilles"),
      new hexagon.Offset(-32, 3)
    );

    movementService.deploy(
      gameData.ships.getShips().find(ship => ship.name === "UCS Eclipse"),
      new hexagon.Offset(-3400000, 3)
    );

    const error = await test.throwsAsync(() =>
      controller.commitDeployment(gameData.id, gameData.serialize(), user)
    );

    test.is(
      error.message,
      "Invalid deployment for ship UCS Eclipse: not a valid deployment location (q: -3400000, r: 3)"
    );
    db.close();
  }
);

test.serial("Submit deployment with ships on same hex", async test => {
  const db = new TestDatabaseConnection("deployment");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = await constructShipsBoughtGame(user, user2, controller);

  const movementService = getMovementService();
  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "UCS Achilles"),
    new hexagon.Offset(-32, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "UCS Eclipse"),
    new hexagon.Offset(-32, 3)
  );

  const error = await test.throwsAsync(() =>
    controller.commitDeployment(gameData.id, gameData.serialize(), user)
  );

  test.is(
    error.message,
    "Invalid deployment: multiple ships on same hex (q: -32, r: 3)"
  );
  db.close();
});

test.serial("Submit valid deployment", async test => {
  const db = new TestDatabaseConnection("deployment");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = await constructShipsBoughtGame(user, user2, controller);

  const movementService = getMovementService();
  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "UCS Achilles"),
    new hexagon.Offset(-32, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "UCS Eclipse"),
    new hexagon.Offset(-34, 3)
  );

  await controller.commitDeployment(gameData.id, gameData.serialize(), user);
  const newGameData = await controller.getGameData(gameData.id);

  const achilles = newGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");
  const eclipse = newGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Eclipse");

  test.true(
    achilles.movement
      .getDeployMove()
      .getHexPosition()
      .equals(new hexagon.Offset(-32, 3))
  );
  test.true(
    eclipse.movement
      .getDeployMove()
      .getHexPosition()
      .equals(new hexagon.Offset(-34, 3))
  );

  test.is(newGameData.phase, "deployment");
  test.false(newGameData.isPlayerActive(user));
  test.true(newGameData.isPlayerActive(user2));
  db.close();
});

test.serial("Submit deployment for both players", async test => {
  const db = new TestDatabaseConnection("deployment");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = await constructShipsBoughtGame(user, user2, controller);

  const movementService = getMovementService();
  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "UCS Achilles"),
    new hexagon.Offset(-32, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "UCS Eclipse"),
    new hexagon.Offset(-34, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "GEPS Biliyaz"),
    new hexagon.Offset(34, 0)
  );

  await controller.commitDeployment(gameData.id, gameData.serialize(), user);
  await controller.commitDeployment(gameData.id, gameData.serialize(), user2);

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

  test.true(
    achilles.movement
      .getDeployMove()
      .getHexPosition()
      .equals(new hexagon.Offset(-32, 3))
  );
  test.true(
    eclipse.movement
      .getDeployMove()
      .getHexPosition()
      .equals(new hexagon.Offset(-34, 3))
  );

  test.true(
    biliyaz.movement
      .getDeployMove()
      .getHexPosition()
      .equals(new hexagon.Offset(34, 0))
  );

  test.is(newGameData.phase, "game");
  test.true(newGameData.isPlayerActive(user));
  test.true(newGameData.isPlayerActive(user2));
  db.close();
});

test.serial("Try to submit deployment twice", async test => {
  const db = new TestDatabaseConnection("deployment");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = await constructShipsBoughtGame(user, user2, controller);

  const movementService = getMovementService();
  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "UCS Achilles"),
    new hexagon.Offset(-32, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "UCS Eclipse"),
    new hexagon.Offset(-34, 3)
  );

  await controller.commitDeployment(gameData.id, gameData.serialize(), user);
  const error = await test.throwsAsync(() =>
    controller.commitDeployment(gameData.id, gameData.serialize(), user)
  );

  test.is(error.message, "Invalid deployment: player not active");
  db.close();
});

test.serial("Try to submit deployment after game has moved on", async test => {
  const db = new TestDatabaseConnection("deployment");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = await constructShipsBoughtGame(user, user2, controller);

  const movementService = getMovementService();
  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "UCS Achilles"),
    new hexagon.Offset(-32, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "UCS Eclipse"),
    new hexagon.Offset(-34, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "GEPS Biliyaz"),
    new hexagon.Offset(34, 0)
  );

  await controller.commitDeployment(gameData.id, gameData.serialize(), user);
  await controller.commitDeployment(gameData.id, gameData.serialize(), user2);
  const error = await test.throwsAsync(() =>
    controller.commitDeployment(gameData.id, gameData.serialize(), user)
  );

  test.is(error.message, "Invalid deployment: game phase is not deployment");

  db.close();
});
