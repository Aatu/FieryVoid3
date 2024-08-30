import { expect, test } from "vitest";
import TestDatabaseConnection from "../support/TestDatabaseConnection";
import { User } from "../../../model/src/User/User";
import CombatLogTorpedoAttack from "../../../model/src/combatLog/CombatLogTorpedoAttack";
import CombatLogTorpedoIntercept from "../../../model/src/combatLog/CombatLogTorpedoIntercept";
import { Offset } from "../../../model/src/hexagon";
import Torpedo158MSV from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo158MSV";
import TorpedoFlight from "../../../model/src/unit/TorpedoFlight";
import Vector from "../../../model/src/utils/Vector";
import GameController from "../../controller/GameController";
import { constructDeployedGame } from "../support/constructGame";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import TorpedoLauncherStrategy from "../../../model/src/unit/system/strategy/weapon/TorpedoLauncherStrategy";

test("Submit successfull launch order", async () => {
  const db = new TestDatabaseConnection("torpedo");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(-30, 0)
  );

  const gameId = gameData.getId();

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!shooter || !target) {
    throw new Error("Shooter or target not found");
  }

  const launchers = shooter.systems
    .getSystemById(202)
    .callHandler(
      SYSTEM_HANDLERS.getLoadedLaunchers,
      null,
      [] as TorpedoLauncherStrategy[]
    );

  if (launchers.length === 0) {
    throw new Error("No launchers found");
  }

  launchers[0].setLaunchTarget(target.id);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);
  const newGameData = await controller.getGameData(gameData.getId(), user);

  const shooterTurn2 = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  if (!shooterTurn2) {
    throw new Error("Shooter not found");
  }

  const launchersTurn2 = shooterTurn2.systems.getSystemById(202);
  expect((launchersTurn2.strategies[1] as any).launchTarget).toBe(null);

  const torpedos = newGameData.torpedos.getTorpedoFlights();

  expect(torpedos.length === 1).toBe(true);

  const actual = torpedos[0];
  actual.id = "";

  const expected = new TorpedoFlight(
    new Torpedo158MSV(),
    target.id,
    shooter.id,
    202,
    1
  )
    .setStrikePosition(new Vector(-324.7595264191645, 37.5))
    .setLaunchPosition(new Vector(-1407.2912811497129, 112.5));

  expected.id = "";
  expect(actual.serialize()).toEqual(expected.serialize());
  db.close();
});

/*
test("Execute a successful torpedo attack", async () => {
  const db = new TestDatabaseConnection("torpedo");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(-20, 0)
  );

  const gameId = gameData.getId();

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!shooter || !target) {
    throw new Error("Shooter or target not found");
  }

  const launchers = shooter.systems
    .getSystemById(203)
    .callHandler(
      SYSTEM_HANDLERS.getLoadedLaunchers,
      null,
      [] as TorpedoLauncherStrategy[]
    );

  launchers[0].setLaunchTarget(target.id);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  let newGameData = await controller.getGameData(gameData.getId(), user);
  await controller.commitTurn(gameData.getId(), newGameData.serialize(), user2);
  await controller.commitTurn(gameData.getId(), newGameData.serialize(), user);

  const replay = await controller["replayHandler"].requestReplay(gameId, 2, 3);

  expect([(replay[0].combatLog.entries[0] as any).notes[0]]).toEqual([
    "MSV with 25 projectiles at distance 5 with hit chance of 25% each.",
  ]);

  expect(replay[0].combatLog.entries[0] instanceof CombatLogTorpedoAttack).toBe(
    true
  );

  db.close();
});

test("Try to intercept torpedo attack", async () => {
  const db = new TestDatabaseConnection("torpedo");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(-20, 0)
  );

  const gameId = gameData.getId();

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  let target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!shooter || !target) {
    throw new Error("Shooter or target not found");
  }

  const launchers = shooter.systems
    .getSystemById(203)
    .callHandler(
      SYSTEM_HANDLERS.getLoadedLaunchers,
      null,
      [] as TorpedoLauncherStrategy[]
    );

  launchers[0].setLaunchTarget(target.id);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  let newGameData = await controller.getGameData(gameData.getId(), user);
  target = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!target) {
    throw new Error("Target not found");
  }

  target.electronicWarfare.assignCcEw(10);

  await controller.commitTurn(gameData.getId(), newGameData.serialize(), user2);
  await controller.commitTurn(gameData.getId(), newGameData.serialize(), user);
  newGameData = await controller.getGameData(gameData.getId(), user);

  target = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");
  //await evaluateTorpedoTurn(2, gameData.getId(), controller, user);

  if (!target) {
    throw new Error("Target not found");
  }

  expect(target.electronicWarfare.inEffect.getCcEw()).toBe(10);

  const replay = await controller["replayHandler"].requestReplay(gameId, 2, 3);

  expect(
    replay[0].combatLog.entries.some(
      (entry) => entry instanceof CombatLogTorpedoIntercept && entry.shipId
    )
  ).toBe(true);

  db.close();
});

test("Try to intercept multiple torpedos", async () => {
  const db = new TestDatabaseConnection("torpedo");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(-20, 0)
  );

  const gameId = gameData.getId();

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  let target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!shooter || !target) {
    throw new Error("Shooter or target not found");
  }

  const launchers = shooter.systems
    .getSystemById(203)
    .callHandler(
      SYSTEM_HANDLERS.getLoadedLaunchers,
      null,
      [] as TorpedoLauncherStrategy[]
    );

  launchers[0].setLaunchTarget(target.id);
  launchers[1].setLaunchTarget(target.id);

  const launchers2 = shooter.systems
    .getSystemById(206)
    .callHandler(
      SYSTEM_HANDLERS.getLoadedLaunchers,
      null,
      [] as TorpedoLauncherStrategy[]
    );

  launchers2[0].setLaunchTarget(target.id);
  launchers2[1].setLaunchTarget(target.id);

  await controller.commitTurn(gameData.getId(), gameData.serialize(), user2);
  await controller.commitTurn(gameData.getId(), gameData.serialize(), user);
  let newGameData = await controller.getGameData(gameData.getId(), user);

  target = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!target) {
    throw new Error("Target not found");
  }

  target.electronicWarfare.assignCcEw(10);

  await controller.commitTurn(gameData.getId(), newGameData.serialize(), user);
  await controller.commitTurn(gameData.getId(), newGameData.serialize(), user2);

  newGameData = await controller.getGameData(gameData.getId(), user);

  target = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");
  //await evaluateTorpedoTurn(2, gameData.getId(), controller, user);

  if (!target) {
    throw new Error("Target not found");
  }

  expect(target.electronicWarfare.inEffect.getCcEw()).toBe(10);

  const replay = await controller["replayHandler"].requestReplay(gameId, 2, 3);

  expect(
    replay[0].combatLog.entries.some(
      (entry) => entry instanceof CombatLogTorpedoIntercept && entry.shipId
    )
  );

  db.close();
});
*/
