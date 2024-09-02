import { expect, test } from "vitest";
import {
  MOVEMENT_TYPE,
  MovementOrder,
  MovementService,
  RequiredThrust,
} from "../../../model/src/movement";
import { TestShip } from "../../../model/src/unit/ships/test";
import GameController from "../../controller/GameController";
import { constructDeployedGame } from "../support/constructGame";
import TestDatabaseConnection from "../support/TestDatabaseConnection";
import Offset from "../../../model/src/hexagon/Offset";
import GameData from "../../../model/src/game/GameData";
import { User } from "../../../model/src/User/User";
import { a } from "vitest/dist/chunks/suite.CcK46U-P";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";

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

const constructShip = (id: string = "123") => {
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

const compareMovements = (moves1: MovementOrder[], moves2: MovementOrder[]) => {
  expect(
    moves1.map((move) =>
      move
        .clone()
        .setRequiredThrust(null as unknown as RequiredThrust)
        .round()
        .setId(null)
    )
  ).toEqual(
    moves2.map((move) =>
      move
        .clone()
        .setRequiredThrust(null as unknown as RequiredThrust)
        .round()
        .setId(null)
    )
  );
};

test("Submit movement for first player, success", async () => {
  const db = new TestDatabaseConnection("movement_submitfirst");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructDeployedGame(user, user2, controller);

  const movementService = getMovementService();

  const ship1 = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!ship1) {
    throw new Error("Could not find ship");
  }

  movementService.thrust(ship1, 0);
  movementService.thrust(ship1, 0);
  movementService.thrust(ship1, 0);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  const newGameData = await controller.getGameData(gameData.getId(), user);

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");
  const eclipse = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Eclipse");
  const biliyaz = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!achilles || !eclipse || !biliyaz) {
    throw new Error("Could not find ship");
  }

  expect(achilles.movement.getMovement().length).toBe(5);
  expect(eclipse.movement.getMovement().length).toBe(2);
  expect(biliyaz.movement.getMovement().length).toBe(2);

  expect(newGameData.isActiveShip(achilles)).toBe(false);
  expect(newGameData.isActiveShip(eclipse)).toBe(false);
  expect(newGameData.isActiveShip(biliyaz)).toBe(true);
  expect(newGameData.isPlayerActive(user)).toBe(false);
  expect(newGameData.isPlayerActive(user2)).toBe(true);

  const newGameData2 = await controller.getGameData(gameData.getId(), user2);
  const achilles2 = newGameData2.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!achilles2) {
    throw new Error("Could not find ship");
  }

  expect(achilles2.movement.getMovement().length).toBe(2);

  db.close();
});

test("Submit movement for both players, success", async () => {
  const db = new TestDatabaseConnection("movement");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructDeployedGame(user, user2, controller);

  const movementService = getMovementService();

  const achillesInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const eclipseInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Eclipse");

  const biliyazInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!achillesInitial || !eclipseInitial || !biliyazInitial) {
    throw new Error("Could not find ships");
  }

  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.evade(achillesInitial, 1);

  movementService.thrust(biliyazInitial, 3);
  movementService.thrust(biliyazInitial, 3);
  movementService.thrust(biliyazInitial, 3);
  movementService.roll(biliyazInitial);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);
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

  if (!achilles || !eclipse || !biliyaz) {
    throw new Error("Could not find ship");
  }

  expect(achilles.movement.getMovement().length).toBe(1);
  expect(eclipse.movement.getMovement().length).toBe(1);
  expect(biliyaz.movement.getMovement().length).toBe(1);
  expect(newGameData.turn).toBe(2);
  expect(newGameData.isActiveShip(achilles)).toBe(true);
  expect(newGameData.isActiveShip(eclipse)).toBe(true);
  expect(newGameData.isActiveShip(biliyaz)).toBe(true);
  expect(newGameData.isPlayerActive(user)).toBe(true);
  expect(newGameData.isPlayerActive(user2)).toBe(true);

  expect(achilles.movement.getActiveEvasion()).toBe(1);

  compareMovements(eclipse.movement.getMovement(), [
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-4, 3),
      new Offset(30, 0),
      0,
      false,
      2
    ).setIndex(3),
  ]);

  compareMovements(achilles.movement.getMovement(), [
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(1, 3),
      new Offset(33, 0),
      0,
      false,
      2,
      0,
      undefined,
      7,
      1
    ),
  ]);

  compareMovements(biliyaz.movement.getMovement(), [
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(1, 0),
      new Offset(-33, 0),
      0,
      true,
      2
    ).setIndex(7),
  ]);

  db.close();
});

/*
test("Use boosted hybrid fusion thrusters", async () => {
  const db = new TestDatabaseConnection("movement");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructDeployedGame(user, user2, controller);

  const movementService = getMovementService();

  const achillesInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!achillesInitial) {
    throw new Error("Could not find ship");
  }

  achillesInitial.systems.getSystemById(5).power.setOffline();
  achillesInitial.systems.getSystemById(6).power.setOffline();

  achillesInitial.systems.getSystemById(3).handlers.boost();
  achillesInitial.systems.getSystemById(3).handlers.boost();
  achillesInitial.systems.getSystemById(3).handlers.boost();
  achillesInitial.systems.getSystemById(3).handlers.boost();
  achillesInitial.systems.getSystemById(3).handlers.boost();
  achillesInitial.systems.getSystemById(3).handlers.boost();

  //achillesInitial.systems.getSystemById(4).callHandler("boost");
  //achillesInitial.systems.getSystemById(4).callHandler("boost");
  //achillesInitial.systems.getSystemById(4).callHandler("boost");
  //achillesInitial.systems.getSystemById(4).callHandler("boost");
  //achillesInitial.systems.getSystemById(4).callHandler("boost");
  //achillesInitial.systems.getSystemById(4).callHandler("boost");

  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);

  const thruster3HeatPrediction = achillesInitial.systems
    .getSystemById(3)
    .heat.predictHeatChange();
  const thruster4HeatPrediction = achillesInitial.systems
    .getSystemById(4)
    .heat.predictHeatChange();

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);
  const newGameData = await controller.getGameData(gameData.getId());

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!achilles) {
    throw new Error("Could not find ship");
  }

  expect(thruster3HeatPrediction.overheat).toEqual(
    achilles.systems.getSystemById(3).heat["overheat"]
  );

  expect(thruster4HeatPrediction.overheat).toEqual(
    achilles.systems.getSystemById(4).heat["overheat"]
  );

  db.close();
});


test("Use hybrid fusion thrusters in chemical mode", async () => {
  const db = new TestDatabaseConnection("movement");
  await db.resetDatabase();

  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructDeployedGame(user, user2, controller);

  const movementService = getMovementService();

  const achillesInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!achillesInitial) {
    throw new Error("Could not find ship");
  }

  const thruster1 = achillesInitial.systems.getSystemById(3);
  const thruster2 = achillesInitial.systems.getSystemById(4);
  thruster1.callHandler(SYSTEM_HANDLERS.changeMode, undefined, undefined);
  thruster2.callHandler(SYSTEM_HANDLERS.changeMode, undefined, undefined);

  //achillesInitial.systems.getSystemById(4).callHandler("boost");
  //achillesInitial.systems.getSystemById(4).callHandler("boost");
  //achillesInitial.systems.getSystemById(4).callHandler("boost");
  //achillesInitial.systems.getSystemById(4).callHandler("boost");
  //achillesInitial.systems.getSystemById(4).callHandler("boost");
  //achillesInitial.systems.getSystemById(4).callHandler("boost");

  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);
  movementService.thrust(achillesInitial, 0);

  const thruster3HeatPrediction = thruster1.heat.predictHeatChange();
  const thruster4HeatPrediction = thruster2.heat.predictHeatChange();

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);
  const newGameData = await controller.getGameData(gameData.getId());

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!achilles) {
    throw new Error("ship not found");
  }

  expect(thruster3HeatPrediction.overheat).toEqual(
    achilles.systems.getSystemById(3).heat["overheat"]
  );

  expect(thruster4HeatPrediction.overheat).toEqual(
    achilles.systems.getSystemById(4).heat["overheat"]
  );

  db.close();
});
*/
