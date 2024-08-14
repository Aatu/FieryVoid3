import { expect, test } from "vitest";
import MovementOrder from "../../../model/src/movement/MovementOrder";
import { MOVEMENT_TYPE, MovementService } from "../../../model/src/movement";
import Offset from "../../../model/src/hexagon/Offset";
import GameData from "../../../model/src/game/GameData";
import TestShip from "../../../model/src/unit/ships/test/TestShip";
import { User } from "../../../model/src/User/User";
import GameController from "../../controller/GameController";
import { constructShipsBoughtGame } from "../support/constructGame";
import TestDatabaseConnection from "../support/TestDatabaseConnection";
import { GAME_PHASE } from "../../../model/src/game/gamePhase";

const startMove = new MovementOrder(
  null,
  MOVEMENT_TYPE.START,
  new Offset(-32, 5),
  new Offset(3, 2),
  0,
  false,
  1
);

const deployMove = new MovementOrder(
  null,
  MOVEMENT_TYPE.DEPLOY,
  new Offset(5, -5),
  startMove.velocity,
  startMove.facing,
  startMove.rolled,
  1
);

const getMovementService = () =>
  new MovementService().update({ turn: 1 } as unknown as GameData, {
    relayEvent: () => null,
  });

const constructShip = (id = "123") => {
  let ship = new TestShip({ id });
  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = (id: string, player: User) => {
  const ship = constructShip(id);
  ship.player.setUser(player);
  ship.movement.addMovement(deployMove);
  return ship;
};

test("Submit deployment, but ship is missing deploy move", async () => {
  const db = new TestDatabaseConnection("deployment");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructShipsBoughtGame(user, user2, controller);

  const movementService = getMovementService();
  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "UCS Achilles")!,
    new Offset(-32, 3)
  );

  const undeployedShip = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Eclipse")!;

  undeployedShip.movement["moves"] = undeployedShip.movement["moves"].filter(
    (move) => !move.isDeploy()
  );

  await expect(() =>
    controller.commitDeployment(gameData.getId(), gameData.serialize(), user)
  ).rejects.toThrow(
    "Invalid deployment for ship UCS Eclipse: deployment missing"
  );

  db.close();
});

test("Submit deployment with invalid deployment position", async () => {
  const db = new TestDatabaseConnection("deployment");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructShipsBoughtGame(user, user2, controller);

  const movementService = getMovementService();
  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "UCS Achilles")!,
    new Offset(-32, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "UCS Eclipse")!,
    new Offset(-3400000, 3)
  );

  await expect(() =>
    controller.commitDeployment(gameData.getId(), gameData.serialize(), user)
  ).rejects.toThrow(
    "Invalid deployment for ship UCS Eclipse: not a valid deployment location (-3400000, 3)"
  );

  db.close();
});

test("Submit deployment with ships on same hex", async () => {
  const db = new TestDatabaseConnection("deployment");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructShipsBoughtGame(user, user2, controller);

  const movementService = getMovementService();
  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "UCS Achilles")!,
    new Offset(-32, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "UCS Eclipse")!,
    new Offset(-32, 3)
  );

  await expect(() =>
    controller.commitDeployment(gameData.getId(), gameData.serialize(), user)
  ).rejects.toThrow("Invalid deployment: multiple ships on same hex (-32, 3)");

  db.close();
});

test("Submit valid deployment", async () => {
  const db = new TestDatabaseConnection("deployment");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructShipsBoughtGame(user, user2, controller);

  const movementService = getMovementService();
  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "UCS Achilles")!,
    new Offset(-32, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "UCS Eclipse")!,
    new Offset(-34, 3)
  );

  await controller.commitDeployment(
    gameData.getId(),
    gameData.serialize(),
    user
  );
  const newGameData = await controller.getGameData(gameData.getId());

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");
  const eclipse = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Eclipse");

  expect(
    achilles!.movement
      .getDeployMove()!
      .getHexPosition()
      .equals(new Offset(-32, 3))
  ).toBe(true);

  expect(
    eclipse!.movement
      .getDeployMove()!
      .getHexPosition()
      .equals(new Offset(-34, 3))
  ).toBe(true);

  expect(newGameData.phase).toEqual(GAME_PHASE.DEPLOYMENT);
  expect(newGameData.isPlayerActive(user)).toBe(false);
  expect(newGameData.isPlayerActive(user2)).toBe(true);
  db.close();
});

test("Submit deployment for both players", async () => {
  const db = new TestDatabaseConnection("deployment");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructShipsBoughtGame(user, user2, controller);

  const movementService = getMovementService();
  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "UCS Achilles")!,
    new Offset(-32, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "UCS Eclipse")!,
    new Offset(-34, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "GEPS Biliyaz")!,
    new Offset(34, 0)
  );

  await controller.commitDeployment(
    gameData.getId(),
    gameData.serialize(),
    user
  );
  await controller.commitDeployment(
    gameData.getId(),
    gameData.serialize(),
    user2
  );

  const newGameData = await controller.getGameData(gameData.getId());

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");
  const eclipse = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Eclipse");
  const biliyaz = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  expect(
    achilles!.movement
      .getDeployMove()!
      .getHexPosition()
      .equals(new Offset(-32, 3))
  );

  expect(
    eclipse!.movement
      .getDeployMove()!
      .getHexPosition()
      .equals(new Offset(-34, 3))
  ).toBe(true);

  expect(
    biliyaz!.movement
      .getDeployMove()!
      .getHexPosition()
      .equals(new Offset(34, 0))
  ).toBe(true);

  expect(newGameData.phase).toEqual(GAME_PHASE.GAME);
  expect(newGameData.isPlayerActive(user)).toBe(true);
  expect(newGameData.isPlayerActive(user2)).toBe(true);
  db.close();
});

test("Try to submit deployment twice", async () => {
  const db = new TestDatabaseConnection("deployment");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructShipsBoughtGame(user, user2, controller);

  const movementService = getMovementService();
  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "UCS Achilles")!,
    new Offset(-32, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "UCS Eclipse")!,
    new Offset(-34, 3)
  );

  await controller.commitDeployment(
    gameData.getId(),
    gameData.serialize(),
    user
  );

  await expect(() =>
    controller.commitDeployment(gameData.getId(), gameData.serialize(), user)
  ).rejects.toThrow("Invalid deployment: player not active");

  db.close();
});

test("Try to submit deployment after game has moved on", async () => {
  const db = new TestDatabaseConnection("deployment");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructShipsBoughtGame(user, user2, controller);

  const movementService = getMovementService();
  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "UCS Achilles")!,
    new Offset(-32, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "UCS Eclipse")!,
    new Offset(-34, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find((ship) => ship.name === "GEPS Biliyaz")!,
    new Offset(34, 0)
  );

  await controller.commitDeployment(
    gameData.getId(),
    gameData.serialize(),
    user
  );
  await controller.commitDeployment(
    gameData.getId(),
    gameData.serialize(),
    user2
  );

  await expect(() =>
    controller.commitDeployment(gameData.getId(), gameData.serialize(), user)
  ).rejects.toThrow("Invalid deployment: game phase is not deployment");

  db.close();
});
