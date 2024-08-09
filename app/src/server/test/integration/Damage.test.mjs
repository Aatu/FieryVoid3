import test from "ava";
import GameController from "../../server/controller/GameController";
import TestDatabaseConnection from "../support/TestDatabaseConnection";
import { constructDeployedGame } from "../support/constructGame";
import WeaponFireService from "../../model/weapon/WeaponFireService";
import User from "../../model/User";

test.serial("Ship gets destroyed", async (test) => {
  const db = new TestDatabaseConnection("damage");
  await db.resetDatabase();

  const controller = new GameController(db);
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");
  let gameData = await constructDeployedGame(user, user2, controller);

  const achillesInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const biliyazInitial = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  achillesInitial.electronicWarfare.assignOffensiveEw(biliyazInitial, 5);

  await controller.commitTurn(gameData.id, gameData.serialize(), user2);
  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  gameData = await controller.getGameData(gameData.id, user);

  const shooter = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const target = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  test.is(gameData.turn, 2);

  const fireService = new WeaponFireService().update(gameData);
  fireService.addFireOrder(shooter, target, shooter.systems.getSystemById(21));

  await controller.commitTurn(gameData.id, gameData.serialize(), user);
  await controller.commitTurn(gameData.id, gameData.serialize(), user2);

  let newGameData = await controller.getGameData(gameData.id, user);

  const biliyaz = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  const achilles = newGameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  test.true(biliyaz.isDestroyed());

  let replay = await controller.replayHandler.requestReplay(
    newGameData.id,
    newGameData.turn - 1,
    newGameData.turn,
    user
  );

  test.true(replay[0].ships.getShipById(biliyaz.id).isDestroyedThisTurn());

  await controller.commitTurn(newGameData.id, newGameData.serialize(), user);
  //await controller.commitTurn(newGameData.id, newGameData.serialize(), user2);

  newGameData = await controller.getGameData(gameData.id, user);

  test.deepEqual(newGameData.turn, 4);

  replay = await controller.replayHandler.requestReplay(
    newGameData.id,
    newGameData.turn - 1,
    newGameData.turn,
    user
  );

  test.false(replay[0].ships.getShipById(biliyaz.id).isDestroyedThisTurn());

  /*

  test.is(biliyaz.systems.getSystemById(7).getRemainingHitpoints(), 10);

  test.false(achilles.systems.getSystemById(20).callHandler("isLoaded"));

  

  const replayAchilles = replay[0].ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const replayFireOrders = replayAchilles.systems
    .getSystemById(20)
    .callHandler("getFireOrders");

  test.deepEqual(
    replay[0].combatLog.entries[0].hitResult.hitChance,

    new WeaponHitChance({
      baseToHit: 100,
      fireControl: 10000,
      dew: 10,
      oew: 5,
      distance: 8,
      rangeModifier: -5,
      result: 10050,
      absoluteResult: 10050,
      rollingPenalty: -20,
      outOfRange: false,
    })
  );

  test.is(replay[0].combatLog.entries[0].damages[0].entries[0].systemId, 7);

  */
  db.close();
});
