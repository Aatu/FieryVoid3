import { expect, test } from "vitest";
import { constructLobbyGame } from "../support/constructGame";
import GameController from "../../controller/GameController";
import TestDatabaseConnection from "../support/TestDatabaseConnection";
import { User } from "../../../model/src/User/User";

test("Take slot", async () => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData.serialize(), user);

  const slot = gameData.slots.getSlots()[1];
  await controller.takeSlot(gameId, slot.id, user2);

  const newGameData = await controller.getGameData(gameId);

  const newSlot = newGameData.slots.getSlots()[1];
  expect(newSlot.userId).toEqual(user2.id);
  expect(newGameData.players.some((player) => player.id === user2.id)).toBe(
    true
  );
  expect(newGameData.isPlayerActive(user2)).toBe(true);
});

test("Leave slot", async () => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData.serialize(), user);
  const slot = gameData.slots.getSlots()[1];

  await controller.takeSlot(gameId, slot.id, user2);
  await controller.leaveSlot(gameId, slot.id, user2);

  const newGameData = await controller.getGameData(gameId);
  const newSlot = newGameData.slots.getSlots()[1];
  expect(newSlot.userId).toEqual(null);
  expect(newGameData.players.every((player) => player.id !== user2.id)).toBe(
    true
  );
  expect(newGameData.isPlayerActive(user2)).toBe(false);
});

test("Leave the last slot", async () => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = User.create(1, "Nönmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData.serialize(), user);
  const slot = gameData.slots.getSlots()[0];

  await controller.leaveSlot(gameId, slot.id, user);

  const newGameData = await controller.getGameData(gameId);
  expect(newGameData.status).toEqual("abandoned");
});

test("Remove the game as a creator", async () => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = User.create(1, "Nönmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData.serialize(), user);
  await controller.removeGame(gameId, user);

  const newGameData = await controller.getGameData(gameId);
  expect(newGameData.status).toEqual("abandoned");
});

test("Fail to remove game as non creator", async () => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData.serialize(), user);

  const slot2 = gameData.slots.getSlots()[1];

  await controller.takeSlot(gameId, slot2.id, user2);
  await expect(() => controller.removeGame(gameId, user2)).rejects.toThrow(
    "Only game creator or last player can remove game"
  );

  const newGameData = await controller.getGameData(gameId);
  expect(newGameData.status).toEqual("lobby");
});

test("Remove game as last player", async () => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData.serialize(), user);

  const slot1 = gameData.slots.getSlots()[0];
  const slot2 = gameData.slots.getSlots()[1];

  await controller.takeSlot(gameId, slot2.id, user2);
  await controller.leaveSlot(gameId, slot1.id, user);
  await controller.removeGame(gameId, user);

  const newGameData = await controller.getGameData(gameId);
  expect(newGameData.status).toEqual("abandoned");
});

test("Take both slots", async () => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData.serialize(), user);
  const slot = gameData.slots.getSlots()[1];

  await controller.takeSlot(gameId, slot.id, user);

  const newGameData = await controller.getGameData(gameId);
  expect(newGameData.slots.getSlots()[0].userId).toEqual(user.id);
  expect(newGameData.slots.getSlots()[1].userId).toEqual(user.id);
  expect(newGameData.players.some((player) => player.id === user.id)).toBe(
    true
  );
  expect(newGameData.players.length).toEqual(1);
  expect(newGameData.isPlayerActive(user2)).toBe(false);
  expect(newGameData.isPlayerActive(user)).toBe(true);
});

test("Take and leave slot", async () => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData.serialize(), user);

  const slot = gameData.slots.getSlots()[1];
  await controller.takeSlot(gameId, slot.id, user);
  await controller.leaveSlot(gameId, slot.id, user);

  const newGameData = await controller.getGameData(gameId);

  expect(newGameData.slots.getSlots()[0].userId).toEqual(user.id);
  expect(newGameData.slots.getSlots()[1].userId).toEqual(null);
  expect(newGameData.players.some((player) => player.id === user.id)).toBe(
    true
  );
  expect(newGameData.players.length).toEqual(1);
  expect(newGameData.isPlayerActive(user2)).toBe(false);
  expect(newGameData.isPlayerActive(user)).toBe(true);
});

test("Try to take occupied slot", async () => {
  const db = new TestDatabaseConnection("take_slot");
  await db.resetDatabase();

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = constructLobbyGame(user);

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData.serialize(), user);
  const slot = gameData.slots.getSlots()[0];

  await expect(() =>
    controller.takeSlot(gameId, slot.id, user2)
  ).rejects.toThrow("Slot already taken");

  const newGameData = await controller.getGameData(gameId);
  expect(newGameData.slots.getSlots()[0].userId).toEqual(user.id);
  expect(newGameData.players.every((player) => player.id !== user2.id)).toBe(
    true
  );
  expect(newGameData.isPlayerActive(user2)).toBe(false);
});
