import { expect, test } from "vitest";
import TestDatabaseConnection from "../support/TestDatabaseConnection";
import { User } from "../../../model/src/User/User";
import { MovementService } from "../../../model/src/movement";
import FireOrder from "../../../model/src/weapon/FireOrder";
import WeaponFireService from "../../../model/src/weapon/WeaponFireService";
import WeaponHitChance from "../../../model/src/weapon/WeaponHitChance";
import GameController from "../../controller/GameController";
import { constructDeployedGame } from "../support/constructGame";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";

test("Submit successfull fire order for first player", async () => {
  const db = new TestDatabaseConnection("fire");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");
  let gameData = await constructDeployedGame(user, user2, controller);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);

  const achillesInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const biliyazInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!achillesInitial || !biliyazInitial) {
    throw new Error("Could not find ships");
  }

  achillesInitial.electronicWarfare.assignOffensiveEw(biliyazInitial, 5);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  gameData = await controller.getGameData(gameData.getId(), user);

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  expect(gameData.turn).toBe(2);

  if (!shooter || !target) {
    throw new Error("Could not find ships");
  }

  const fireService = new WeaponFireService().update(gameData);
  fireService.addFireOrder(shooter, target, shooter.systems.getSystemById(20));
  expect(
    shooter.systems
      .getSystemById(20)
      .callHandler(SYSTEM_HANDLERS.getFireOrders, undefined, [] as FireOrder[])
  ).toEqual([
    new FireOrder(null, shooter, target, shooter.systems.getSystemById(20)),
  ]);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  const newGameData = await controller.getGameData(gameData.getId(), user);

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!achilles) {
    throw new Error("Could not find ships");
  }

  expect(
    achilles.systems
      .getSystemById(20)
      .callHandler(SYSTEM_HANDLERS.getFireOrders, undefined, [] as FireOrder[])
      .map((order) => order.setId(null))
  ).toEqual([
    new FireOrder(null, shooter, target, shooter.systems.getSystemById(20)),
  ]);

  const opponentGameData = await controller.getGameData(
    gameData.getId(),
    user2
  );

  const opponent = opponentGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!opponent) {
    throw new Error("Could not find ship");
  }

  expect(
    opponent.systems
      .getSystemById(20)
      .callHandler(SYSTEM_HANDLERS.getFireOrders, undefined, [] as FireOrder[])
  ).toEqual([]);

  db.close();
});

test("Submit successfull fire order for both players", async () => {
  const db = new TestDatabaseConnection("fire");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");
  let gameData = await constructDeployedGame(user, user2, controller);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);

  const achillesInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const biliyazInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!achillesInitial || !biliyazInitial) {
    throw new Error("Could not find ships");
  }

  achillesInitial.electronicWarfare.assignOffensiveEw(biliyazInitial, 5);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  gameData = await controller.getGameData(gameData.getId(), user);

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  expect(gameData.turn).toBe(2);

  if (!shooter || !target) {
    throw new Error("Could not find ships");
  }

  const fireService = new WeaponFireService().update(gameData);
  fireService.addFireOrder(shooter, target, shooter.systems.getSystemById(20));
  expect(
    shooter.systems
      .getSystemById(20)
      .callHandler(SYSTEM_HANDLERS.getFireOrders, undefined, [] as FireOrder[])
  ).toEqual([
    new FireOrder(null, shooter, target, shooter.systems.getSystemById(20)),
  ]);

  new MovementService()
    .update(gameData, { relayEvent: () => null })
    .roll(shooter);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);

  const commitTurnResponse = await controller.commitTurn(
    gameData.getId(),
    gameData.serialize(),
    user2
  );

  const newGameData = await controller.getGameData(gameData.getId(), user);

  const biliyaz = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!biliyaz || !achilles) {
    throw new Error("ships not found");
  }

  expect(biliyaz.systems.getSystemById(7).getRemainingHitpoints()).toBe(10);

  expect(
    achilles.systems
      .getSystemById(20)
      .callHandler(SYSTEM_HANDLERS.isLoaded, undefined, false as boolean)
  ).toBe(false);

  const replay = await controller["replayHandler"].requestReplay(
    newGameData.getId(),
    newGameData.turn - 1,
    newGameData.turn
  );

  const replayAchilles = replay[0].ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!replayAchilles) {
    throw new Error("no achilles");
  }

  const replayFireOrders = replayAchilles.systems
    .getSystemById(20)
    .callHandler(SYSTEM_HANDLERS.getFireOrders, undefined, [] as FireOrder[]);

  expect((replay[0].combatLog.entries[0] as any).hitResult.hitChance).toEqual(
    new WeaponHitChance({
      baseToHit: 100,
      fireControl: 10000,
      dew: 10,
      oew: 5,
      distance: 8,
      rangeModifier: -5,
      result: 10150,
      absoluteResult: 10150,
      rollingPenalty: -20,
      outOfRange: false,
    })
  );

  expect(
    (replay[0].combatLog.entries[0] as any).damages[0].entries[0].systemId
  ).toEqual(7);

  db.close();
});

test("Submit successfull fire order with roll and pivot", async () => {
  const db = new TestDatabaseConnection("fire");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");
  let gameData = await constructDeployedGame(user, user2, controller);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);

  const achillesInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const biliyazInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!achillesInitial || !biliyazInitial) {
    throw new Error("Could not find ships");
  }

  achillesInitial.electronicWarfare.assignOffensiveEw(biliyazInitial, 5);
  const ms = new MovementService().update(gameData, {
    relayEvent: () => null,
  });

  ms.roll(achillesInitial);
  ms.pivot(achillesInitial, 1);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  gameData = await controller.getGameData(gameData.getId(), user);

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  expect(gameData.turn).toBe(2);

  if (!shooter || !target) {
    throw new Error("Could not find ships");
  }

  const fireService = new WeaponFireService().update(gameData);
  expect(
    fireService.canFire(shooter, target, shooter.systems.getSystemById(20))
  ).toBe(true);

  fireService.addFireOrder(shooter, target, shooter.systems.getSystemById(20));
  expect(
    shooter.systems
      .getSystemById(20)
      .callHandler(SYSTEM_HANDLERS.getFireOrders, undefined, [] as FireOrder[])
  ).toEqual([
    new FireOrder(null, shooter, target, shooter.systems.getSystemById(20)),
  ]);

  new MovementService()
    .update(gameData, { relayEvent: () => null })
    .roll(shooter);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);

  const commitTurnResponse = await controller.commitTurn(
    gameData.getId(),
    gameData.serialize(),
    user2
  );

  const newGameData = await controller.getGameData(gameData.getId(), user);

  const biliyaz = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!biliyaz || !achilles) {
    throw new Error("ships not found");
  }

  expect(biliyaz.systems.getSystemById(7).getRemainingHitpoints()).toBe(10);

  expect(
    achilles.systems
      .getSystemById(20)
      .callHandler(SYSTEM_HANDLERS.isLoaded, undefined, false as boolean)
  ).toBe(false);

  const replay = await controller["replayHandler"].requestReplay(
    newGameData.getId(),
    newGameData.turn - 1,
    newGameData.turn
  );

  const replayAchilles = replay[0].ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!replayAchilles) {
    throw new Error("no achilles");
  }

  const replayFireOrders = replayAchilles.systems
    .getSystemById(20)
    .callHandler(SYSTEM_HANDLERS.getFireOrders, undefined, [] as FireOrder[]);

  expect((replay[0].combatLog.entries[0] as any).hitResult.hitChance).toEqual(
    new WeaponHitChance({
      baseToHit: 100,
      fireControl: 10000,
      dew: 10,
      oew: 5,
      distance: 8,
      rangeModifier: -5,
      result: 10150,
      absoluteResult: 10150,
      rollingPenalty: -20,
      outOfRange: false,
    })
  );

  expect(
    (replay[0].combatLog.entries[0] as any).damages[0].entries[0].systemId
  ).toBe(7);

  db.close();
});
