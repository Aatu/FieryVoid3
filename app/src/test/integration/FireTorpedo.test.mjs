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
import WeaponHitChance from "../../model/weapon/WeaponHitChance.mjs";
import TorpedoFlight from "../../model/unit/TorpedoFlight.mjs";
import Torpedo158MSV from "../../model/unit/system/weapon/ammunition/torpedo/Torpedo158MSV.mjs";
import Vector from "../../model/utils/Vector.mjs";
import Offset from "../../model/hexagon/Offset.mjs";
import coordinateConverter from "../../model/utils/CoordinateConverter.mjs";
import CombatLogTorpedoLaunch from "../../model/combatLog/CombatLogTorpedoLaunch.mjs";
import CombatLogTorpedoAttack from "../../model/combatLog/CombatLogTorpedoAttack.mjs";
import CombatLogTorpedoMove from "../../model/combatLog/CombatLogTorpedoMove.mjs";
import CombatLogDamageEntry from "../../model/combatLog/CombatLogDamageEntry.mjs";
import CombatLogWeaponFireHitResult from "../../model/combatLog/CombatLogWeaponFireHitResult.mjs";
import CombatLogTorpedoIntercept from "../../model/combatLog/CombatLogTorpedoIntercept.mjs";

test.serial("Submit successfull launch order", async (test) => {
  const db = new TestDatabaseConnection("torpedo");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(-30, 0)
  );

  const gameId = gameData.id;

  await controller.commitTurn(gameData.id, gameData.serialize(), user2);

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  const launchers = shooter.systems
    .getSystemById(202)
    .callHandler("getLoadedLaunchers", null, []);

  launchers[0].setLaunchTarget(target.id);

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  const newGameData = await controller.getGameData(gameData.id, user);

  const shooterTurn2 = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const launchersTurn2 = shooterTurn2.systems.getSystemById(202);
  test.is(launchersTurn2.strategies[1].launchTarget, null);

  const torpedos = newGameData.torpedos.getTorpedoFlights();

  test.true(torpedos.length === 1);

  const actual = torpedos[0];
  actual.id = null;

  const expected = new TorpedoFlight(
    new Torpedo158MSV(),
    target.id,
    shooter.id,
    202,
    1
  )
    .setStrikePosition(new Vector(-324.7595264191645, 37.5))
    .setLaunchPosition(new Vector(-1407.2912811497129, 112.5));

  expected.id = null;
  test.deepEqual(actual, expected);
  db.close();
});

test.serial("Execute a successful torpedo attack", async (test) => {
  const db = new TestDatabaseConnection("torpedo");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(-20, 0)
  );

  const gameId = gameData.id;

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  const launchers = shooter.systems
    .getSystemById(203)
    .callHandler("getLoadedLaunchers", null, []);

  launchers[0].setLaunchTarget(target.id);

  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  let newGameData = await controller.getGameData(gameData.id, user);
  await controller.commitTurn(gameData.id, newGameData.serialize(), user2);
  await controller.commitTurn(gameData.id, newGameData.serialize(), user);

  const replay = await controller.replayHandler.requestReplay(
    gameId,
    2,
    3,
    user
  );

  test.deepEqual(
    [replay[0].combatLog.entries[0].notes[0]],
    ["MSV with 25 projectiles at distance 5 with hit chance of 25% each."]
  );

  test.true(replay[0].combatLog.entries[0] instanceof CombatLogTorpedoAttack);

  db.close();
});

test.serial("Try to intercept torpedo attack", async (test) => {
  const db = new TestDatabaseConnection("torpedo");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(-20, 0)
  );

  const gameId = gameData.id;

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  let target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  const launchers = shooter.systems
    .getSystemById(203)
    .callHandler("getLoadedLaunchers", null, []);

  launchers[0].setLaunchTarget(target.id);

  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  let newGameData = await controller.getGameData(gameData.id, user);
  target = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  target.electronicWarfare.assignCcEw(10);

  await controller.commitTurn(gameData.id, newGameData.serialize(), user2);
  await controller.commitTurn(gameData.id, newGameData.serialize(), user);
  newGameData = await controller.getGameData(gameData.id, user);

  target = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");
  //await evaluateTorpedoTurn(2, gameData.id, controller, user);

  test.is(target.electronicWarfare.inEffect.getCcEw(), 10);

  const replay = await controller.replayHandler.requestReplay(
    gameId,
    2,
    3,
    user
  );

  test.true(
    replay[0].combatLog.entries.some(
      (entry) => entry instanceof CombatLogTorpedoIntercept && entry.shipId
    )
  );

  db.close();
});

test.serial("Try to intercept multiple torpedos", async (test) => {
  const db = new TestDatabaseConnection("torpedo");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(-20, 0)
  );

  const gameId = gameData.id;

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  let target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  const launchers = shooter.systems
    .getSystemById(203)
    .callHandler("getLoadedLaunchers", null, []);

  launchers[0].setLaunchTarget(target.id);
  launchers[1].setLaunchTarget(target.id);

  const launchers2 = shooter.systems
    .getSystemById(206)
    .callHandler("getLoadedLaunchers", null, []);

  launchers2[0].setLaunchTarget(target.id);
  launchers2[1].setLaunchTarget(target.id);

  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  let newGameData = await controller.getGameData(gameData.id, user);

  target = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  target.electronicWarfare.assignCcEw(10);

  await controller.commitTurn(gameData.id, newGameData.serialize(), user);
  await controller.commitTurn(gameData.id, newGameData.serialize(), user2);

  newGameData = await controller.getGameData(gameData.id, user);

  target = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");
  //await evaluateTorpedoTurn(2, gameData.id, controller, user);

  test.is(target.electronicWarfare.inEffect.getCcEw(), 10);

  const replay = await controller.replayHandler.requestReplay(
    gameId,
    2,
    3,
    user
  );

  test.true(
    replay[0].combatLog.entries.some(
      (entry) => entry instanceof CombatLogTorpedoIntercept && entry.shipId
    )
  );

  db.close();
});
