import test from "ava";
import GameController from "../../server/controller/GameController.mjs";
import TestDatabaseConnection from "../support/TestDatabaseConnection.mjs";
import User from "../../model/User";
import GameData from "../../model/game/GameData.mjs";
import GameSlot from "../../model/game/GameSlot.mjs";
import hexagon from "../../model/hexagon";
import { constructLobbyGame } from "../support/constructGame.mjs";

test.serial("Take slot", async test => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData, user);

  const slot = gameData.slots.getSlots()[1];
  await controller.takeSlot(gameId, slot.id, user2);

  const newGameData = await controller.getGameData(gameId);

  const newSlot = newGameData.slots.getSlots()[1];
  test.is(newSlot.userId, user2.id);
  test.true(newGameData.players.some(player => player.id === user2.id));
  test.true(newGameData.isPlayerActive(user2));
});

test.serial("Leave slot", async test => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData, user);
  const slot = gameData.slots.getSlots()[1];

  await controller.takeSlot(gameId, slot.id, user2);
  await controller.leaveSlot(gameId, slot.id, user2);

  const newGameData = await controller.getGameData(gameId);
  const newSlot = newGameData.slots.getSlots()[1];
  test.is(newSlot.userId, null);
  test.true(newGameData.players.every(player => player.id !== user2.id));
  test.false(newGameData.isPlayerActive(user2));
});

test.serial("Leave the last slot", async test => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = new User(1, "Nönmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData, user);
  const slot = gameData.slots.getSlots()[0];

  await controller.leaveSlot(gameId, slot.id, user);

  const newGameData = await controller.getGameData(gameId);
  test.is(newGameData.status, "abandoned");
});

test.serial("Remove the game as a creator", async test => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = new User(1, "Nönmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData, user);
  await controller.removeGame(gameId, user);

  const newGameData = await controller.getGameData(gameId);
  test.is(newGameData.status, "abandoned");
});

test.serial("Fail to remove game as non creator", async test => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData, user);

  const slot2 = gameData.slots.getSlots()[1];

  await controller.takeSlot(gameId, slot2.id, user2);
  const error = await test.throwsAsync(() =>
    controller.removeGame(gameId, user2)
  );
  test.is(error.message, "Only game creator or last player can remove game");

  const newGameData = await controller.getGameData(gameId);
  test.is(newGameData.status, "lobby");
});

test.serial("Remove game as last player", async test => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData, user);

  const slot1 = gameData.slots.getSlots()[0];
  const slot2 = gameData.slots.getSlots()[1];

  await controller.takeSlot(gameId, slot2.id, user2);
  await controller.leaveSlot(gameId, slot1.id, user);
  await controller.removeGame(gameId, user);

  const newGameData = await controller.getGameData(gameId);
  test.is(newGameData.status, "abandoned");
});

test.serial("Take both slots", async test => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData, user);
  const slot = gameData.slots.getSlots()[1];

  await controller.takeSlot(gameId, slot.id, user);

  const newGameData = await controller.getGameData(gameId);
  test.is(newGameData.slots.getSlots()[0].userId, user.id);
  test.is(newGameData.slots.getSlots()[1].userId, user.id);
  test.true(newGameData.players.some(player => player.id === user.id));
  test.is(newGameData.players.length, 1);
  test.false(newGameData.isPlayerActive(user2));
  test.true(newGameData.isPlayerActive(user));
});

test.serial("Take and leave slot", async test => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData, user);

  const slot = gameData.slots.getSlots()[1];
  await controller.takeSlot(gameId, slot.id, user);
  await controller.leaveSlot(gameId, slot.id, user);

  const newGameData = await controller.getGameData(gameId);

  test.is(newGameData.slots.getSlots()[0].userId, user.id);
  test.is(newGameData.slots.getSlots()[1].userId, null);
  test.true(newGameData.players.some(player => player.id === user.id));
  test.is(newGameData.players.length, 1);
  test.false(newGameData.isPlayerActive(user2));
  test.true(newGameData.isPlayerActive(user));
});

test.serial("Try to take occupied slot", async test => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData, user);
  const slot = gameData.slots.getSlots()[0];

  const error = await test.throwsAsync(() =>
    controller.takeSlot(gameId, slot.id, user2)
  );
  test.is(error.message, "Slot already taken");

  const newGameData = await controller.getGameData(gameId);
  test.is(newGameData.slots.getSlots()[0].userId, user.id);
  test.true(newGameData.players.every(player => player.id !== user2.id));
  test.false(newGameData.isPlayerActive(user2));
});
