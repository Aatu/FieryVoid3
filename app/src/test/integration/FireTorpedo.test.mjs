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
import WeaponHitChange from "../../model/weapon/WeaponHitChange.mjs";
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

test.serial("Submit successfull launch order", async test => {
  const db = new TestDatabaseConnection("torpedo");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(-100, 0)
  );

  const gameId = gameData.id;

  await controller.commitTurn(gameData.id, gameData.serialize(), user2);

  const shooter = gameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  const launchers = shooter.systems
    .getSystemById(202)
    .callHandler("getLoadedLaunchers", null, []);

  launchers[0].setLaunchTarget(target.id);

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  const newGameData = await controller.getGameData(gameData.id, user);

  const shooterTurn2 = newGameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  const launchersTurn2 = shooterTurn2.systems.getSystemById(202);
  test.is(launchersTurn2.strategies[1].launchTarget, null);

  const torpedos = newGameData.torpedos.getTorpedoFlights();

  test.true(torpedos.length === 1);

  const actual = torpedos[0];
  const flightId = actual.id;
  actual.id = null;

  const expected = new TorpedoFlight(
    new Torpedo158MSV(),
    target.id,
    shooter.id,
    202,
    1
  )
    .setPosition(new Vector(-1050.7582835488479, 29.239878414193175))
    .setVelocity(new Vector(1687.3445744592227, -54.02024317161365))
    .setLaunchPosition(new Vector(-2219.190097197624, 56.25));

  expected.id = null;
  expected.turnsActive = 1;
  test.deepEqual(actual, expected);

  const replay = await controller.replayHandler.requestReplay(
    gameId,
    1,
    2,
    user
  );

  test.deepEqual(
    [replay[0].combatLog.entries[3], replay[0].combatLog.entries[4]],
    [
      new CombatLogTorpedoLaunch(flightId),
      new CombatLogTorpedoMove(
        flightId,
        new Vector(-2219.190097197624, 56.25),
        new Vector(-1050.7582835488479, 29.239878414193175),
        new Vector(1687.3445744592227, -54.02024317161365)
      )
    ]
  );

  db.close();
});

test.serial("Execute a successful torpedo attack", async test => {
  const db = new TestDatabaseConnection("torpedo");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(-200, 0)
  );

  const gameId = gameData.id;

  await controller.commitTurn(gameData.id, gameData.serialize(), user2);

  const shooter = gameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  const launchers = shooter.systems
    .getSystemById(203)
    .callHandler("getLoadedLaunchers", null, []);

  launchers[0].setLaunchTarget(target.id);

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  let newGameData = await controller.getGameData(gameData.id, user);
  //await evaluateTorpedoTurn(1, gameData.id, controller, user);
  await assertTorpedoMove(
    1,
    gameData.id,
    controller,
    user,
    test,
    new Offset(-202, 3),
    new Offset(-151, 3),
    new Offset(72, -1)
  );

  await controller.commitTurn(gameData.id, newGameData.serialize(), user);
  await controller.commitTurn(gameData.id, newGameData.serialize(), user2);
  newGameData = await controller.getGameData(gameData.id, user);

  await assertTorpedoMove(
    2,
    gameData.id,
    controller,
    user,
    test,
    new Offset(-151, 3),
    new Offset(-58, 1),
    new Offset(114, -2)
  );

  await controller.commitTurn(gameData.id, newGameData.serialize(), user);
  await controller.commitTurn(gameData.id, newGameData.serialize(), user2);
  newGameData = await controller.getGameData(gameData.id, user);

  //await evaluateTorpedoTurn(2, gameData.id, controller, user);

  const replay = await controller.replayHandler.requestReplay(
    gameId,
    3,
    4,
    user
  );

  test.deepEqual(replay[0].combatLog.entries[3].notes, [
    "Effectiveness 100%",
    "MSV with 25 projectiles at distance 5 with hit chance of 25% each."
  ]);

  test.true(replay[0].combatLog.entries[3] instanceof CombatLogTorpedoAttack);

  db.close();
});

test.serial("Try to intercept torpedo attack", async test => {
  const db = new TestDatabaseConnection("torpedo");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(-200, 0)
  );

  const gameId = gameData.id;

  await controller.commitTurn(gameData.id, gameData.serialize(), user2);

  const shooter = gameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  let target = gameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  const launchers = shooter.systems
    .getSystemById(203)
    .callHandler("getLoadedLaunchers", null, []);

  launchers[0].setLaunchTarget(target.id);

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  let newGameData = await controller.getGameData(gameData.id, user);

  await assertTorpedoMove(
    1,
    gameData.id,
    controller,
    user,
    test,
    new Offset(-202, 3),
    new Offset(-151, 3),
    new Offset(72, -1)
  );

  await controller.commitTurn(gameData.id, newGameData.serialize(), user);
  await controller.commitTurn(gameData.id, newGameData.serialize(), user2);
  newGameData = await controller.getGameData(gameData.id, user);

  target = newGameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  target.electronicWarfare.assignCcEw(10);

  await controller.commitTurn(gameData.id, newGameData.serialize(), user);
  await controller.commitTurn(gameData.id, newGameData.serialize(), user2);
  newGameData = await controller.getGameData(gameData.id, user);

  target = newGameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");
  //await evaluateTorpedoTurn(2, gameData.id, controller, user);

  test.is(target.electronicWarfare.inEffect.getCcEw(), 10);

  const replay = await controller.replayHandler.requestReplay(
    gameId,
    3,
    4,
    user
  );

  test.true(
    replay[0].combatLog.entries.some(
      entry => entry instanceof CombatLogTorpedoIntercept && entry.shipId
    )
  );

  db.close();
});

test.serial("Try to intercept multiple torpedos", async test => {
  const db = new TestDatabaseConnection("torpedo");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(
    user,
    user2,
    controller,
    new Offset(-200, 0)
  );

  const gameId = gameData.id;

  await controller.commitTurn(gameData.id, gameData.serialize(), user2);

  const shooter = gameData.ships
    .getShips()
    .find(ship => ship.name === "UCS Achilles");

  let target = gameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

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

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  let newGameData = await controller.getGameData(gameData.id, user);
  //await evaluateTorpedoTurn(1, gameData.id, controller, user);

  await assertTorpedoMove(
    1,
    gameData.id,
    controller,
    user,
    test,
    new Offset(-202, 3),
    new Offset(-151, 3),
    new Offset(72, -1)
  );

  await controller.commitTurn(gameData.id, newGameData.serialize(), user);
  await controller.commitTurn(gameData.id, newGameData.serialize(), user2);

  target = newGameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");

  target.electronicWarfare.assignCcEw(10);

  await controller.commitTurn(gameData.id, newGameData.serialize(), user);
  await controller.commitTurn(gameData.id, newGameData.serialize(), user2);

  newGameData = await controller.getGameData(gameData.id, user);

  target = newGameData.ships
    .getShips()
    .find(ship => ship.name === "GEPS Biliyaz");
  //await evaluateTorpedoTurn(2, gameData.id, controller, user);

  test.is(target.electronicWarfare.inEffect.getCcEw(), 10);

  const replay = await controller.replayHandler.requestReplay(
    gameId,
    3,
    4,
    user
  );

  console.log(replay[0].combatLog.entries);

  test.true(
    replay[0].combatLog.entries.some(
      entry => entry instanceof CombatLogTorpedoIntercept && entry.shipId
    )
  );

  db.close();
});

const assertTorpedoMove = async (
  turn,
  gameId,
  controller,
  user,
  test,
  position1,
  position2,
  velocity
) => {
  const replay = await controller.replayHandler.requestReplay(
    gameId,
    turn,
    turn + 1,
    user
  );

  const entries = replay[0].combatLog.entries.filter(
    entry => entry instanceof CombatLogTorpedoMove
  );

  if (entries.length === 0) {
    throw new Error("Torpedo move not found");
  }

  entries.forEach(entry => {
    test.deepEqual(
      coordinateConverter.fromGameToHex(entry.startPosition),
      position1
    );
    test.deepEqual(
      coordinateConverter.fromGameToHex(entry.endPosition),
      position2
    );

    test.deepEqual(coordinateConverter.fromGameToHex(entry.velocity), velocity);
  });
};

const evaluateTorpedoTurn = async (turn, gameId, controller, user) => {
  const replay = await controller.replayHandler.requestReplay(
    gameId,
    turn,
    turn + 1,
    user
  );

  console.log(replay[0].combatLog.entries);
};
