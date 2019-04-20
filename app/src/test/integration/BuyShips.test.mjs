import test from "ava";
import GameController from "../../server/controller/GameController.mjs";
import TestDatabaseConnection from "../support/TestDatabaseConnection.mjs";
import User from "../../model/User";
import GameData from "../../model/game/GameData.mjs";
import GameSlot from "../../model/game/GameSlot.mjs";
import hexagon from "../../model/hexagon";
import { constructLobbyGameWithSlotsTaken } from "../support/constructGame.mjs";
import TestShip from "../../model/unit/ships/test/TestShip";

test.serial("Buy ships for first player", async test => {
  const db = new TestDatabaseConnection("buy_ships");
  await db.resetDatabase();
  const controller = new GameController(db);

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = await constructLobbyGameWithSlotsTaken(
    user,
    user2,
    controller
  );
  const slot1 = gameData.slots.getSlots()[0];

  await controller.buyShips(
    gameData.id,
    slot1.id,
    [
      new TestShip({ name: "UCS Achilles" }).serialize(),
      new TestShip({ name: "UCS Eclipse" }).serialize()
    ],
    user
  );

  const newGameData = await controller.getGameData(gameData.id);

  const ships = newGameData.ships.getShips();

  test.is(ships.length, 2);
  test.not(ships[0].id, null);
  test.not(ships[1].id, null);
  test.is(ships[0].player.user.id, user.id);
  test.is(ships[1].player.user.id, user.id);
  test.is(ships[0].slotId, slot1.id);
  test.is(ships[1].slotId, slot1.id);
  test.true(
    newGameData.slots.getSlotById(slot1.id).shipIds.includes(ships[0].id)
  );
  test.true(
    newGameData.slots.getSlotById(slot1.id).shipIds.includes(ships[1].id)
  );
  test.true(newGameData.slots.getSlotById(slot1.id).isBought());
  test.false(newGameData.isPlayerActive(user));
});

test.serial("Buy ships for player that is in multiple slots", async test => {
  const db = new TestDatabaseConnection("buy_ships");
  await db.resetDatabase();
  const controller = new GameController(db);

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = await constructLobbyGameWithSlotsTaken(
    user,
    user2,
    controller
  );
  const slot1 = gameData.slots.getSlots()[0];
  const slot2 = gameData.slots.getSlots()[1];

  await controller.leaveSlot(gameData.id, slot2.id, user2);
  await controller.takeSlot(gameData.id, slot2.id, user);
  await controller.buyShips(
    gameData.id,
    slot1.id,
    [
      new TestShip({ name: "UCS Achilles" }).serialize(),
      new TestShip({ name: "UCS Eclipse" }).serialize()
    ],
    user
  );

  const newGameData = await controller.getGameData(gameData.id);

  const ships = newGameData.ships.getShips();

  test.is(ships.length, 2);
  test.not(ships[0].id, null);
  test.not(ships[1].id, null);
  test.true(
    newGameData.slots.getSlotById(slot1.id).shipIds.includes(ships[0].id)
  );
  test.true(
    newGameData.slots.getSlotById(slot1.id).shipIds.includes(ships[1].id)
  );
  test.true(newGameData.slots.getSlotById(slot1.id).isBought());
  test.true(newGameData.isPlayerActive(user));
});

test.serial("Buy ships for both players", async test => {
  const db = new TestDatabaseConnection("buy_ships");
  await db.resetDatabase();
  const controller = new GameController(db);

  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = await constructLobbyGameWithSlotsTaken(
    user,
    user2,
    controller
  );
  const slot1 = gameData.slots.getSlots()[0];
  const slot2 = gameData.slots.getSlots()[1];

  await controller.buyShips(
    gameData.id,
    slot1.id,
    [
      new TestShip({ name: "UCS Achilles" }).serialize(),
      new TestShip({ name: "UCS Eclipse" }).serialize()
    ],
    user
  );

  await controller.buyShips(
    gameData.id,
    slot2.id,
    [new TestShip({ name: "GEPS Biliyaz" }).serialize()],
    user2
  );

  const newGameData = await controller.getGameData(gameData.id);

  const ships = newGameData.ships.getShips();

  test.is(ships.length, 3);
  test.not(ships[0].id, null);
  test.not(ships[1].id, null);
  test.not(ships[2].id, null);

  const biliyaz = ships.find(ship => ship.name === "GEPS Biliyaz");
  const achilles = ships.find(ship => ship.name === "UCS Achilles");
  const eclipse = ships.find(ship => ship.name === "UCS Eclipse");

  test.true(
    newGameData.slots.getSlotById(slot1.id).shipIds.includes(achilles.id)
  );
  test.true(
    newGameData.slots.getSlotById(slot1.id).shipIds.includes(eclipse.id)
  );
  test.true(
    newGameData.slots.getSlotById(slot2.id).shipIds.includes(biliyaz.id)
  );
});
