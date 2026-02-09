import { expect, test } from "vitest";
import MovementOrder from "../../../model/src/movement/MovementOrder";
import RequiredThrust from "../../../model/src/movement/RequiredThrust";
import { User } from "../../../model/src/User/User";
import GameController from "../../controller/GameController";
import { Impetous } from "../../../model/src/unit/ships/federation";
import { TestShip } from "../../../model/src/unit/ships/test";
import Torpedo158MSV from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo158MSV";
import { constructLobbyGameWithSlotsTaken } from "../support/constructGame";
import TestDatabaseConnection from "../support/TestDatabaseConnection";
import Offset from "../../../model/src/hexagon/Offset";
import { MOVEMENT_TYPE } from "../../../model/src/movement";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";

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

test("Buy ships for first player", async () => {
  const db = new TestDatabaseConnection("buy_ships");
  await db.resetDatabase();
  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructLobbyGameWithSlotsTaken(
    user,
    user2,
    controller
  );

  const slot1 = gameData.slots.getSlots()[0];

  await controller.buyShips(
    gameData.getId(),
    slot1.id,
    [
      new TestShip({ name: "UCS Achilles" }).serialize(),
      new TestShip({ name: "UCS Eclipse" }).serialize(),
    ],
    user
  );

  const newGameData = await controller.getGameData(gameData.getId());

  const ships = newGameData.ships.getShips();

  expect(ships.length).toBe(2);
  expect(ships[0].id).not.toBe(null);
  expect(ships[1].id).not.toBe(null);
  expect(ships[0].getPlayer().getUser().id).toEqual(user.id);
  expect(ships[1].getPlayer().getUser().id).toEqual(user.id);
  expect(ships[0].slotId, slot1.id);
  expect(ships[1].slotId, slot1.id);
  expect(
    newGameData.slots.getSlotById(slot1.id)!.shipIds.includes(ships[0].id)
  ).toBe(true);
  expect(
    newGameData.slots.getSlotById(slot1.id)!.shipIds.includes(ships[1].id)
  ).toBe(true);
  expect(newGameData.slots.getSlotById(slot1.id)!.isBought()).toBe(true);
  expect(newGameData.isPlayerActive(user)).toBe(false);

  expect(ships[0].movement.getDeployMove()!.index).toEqual(2);
  expect(ships[0].movement.getStartMove().index).toEqual(1);
});

test("Buy ships for player that is in multiple slots", async () => {
  const db = new TestDatabaseConnection("buy_ships");
  await db.resetDatabase();
  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructLobbyGameWithSlotsTaken(
    user,
    user2,
    controller
  );
  const slot1 = gameData.slots.getSlots()[0];
  const slot2 = gameData.slots.getSlots()[1];

  await controller.leaveSlot(gameData.getId(), slot2.id, user2);
  await controller.takeSlot(gameData.getId(), slot2.id, user);
  await controller.buyShips(
    gameData.getId(),
    slot1.id,
    [
      new TestShip({ name: "UCS Achilles" }).serialize(),
      new TestShip({ name: "UCS Eclipse" }).serialize(),
    ],
    user
  );

  const newGameData = await controller.getGameData(gameData.getId());

  const ships = newGameData.ships.getShips();

  expect(ships.length).toBe(2);
  expect(ships[0].id).not.toBe(null);
  expect(ships[1].id).not.toBe(null);
  expect(
    newGameData.slots.getSlotById(slot1.id)!.shipIds.includes(ships[0].id)
  ).toBe(true);
  expect(
    newGameData.slots.getSlotById(slot1.id)!.shipIds.includes(ships[1].id)
  ).toBe(true);
  expect(newGameData.slots.getSlotById(slot1.id)!.isBought()).toBe(true);
  expect(newGameData.isPlayerActive(user)).toBe(true);
});

test("Buy ships for both players", async () => {
  const db = new TestDatabaseConnection("buy_ships");
  await db.resetDatabase();
  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructLobbyGameWithSlotsTaken(
    user,
    user2,
    controller
  );
  const slot1 = gameData.slots.getSlots()[0];
  const slot2 = gameData.slots.getSlots()[1];

  await controller.buyShips(
    gameData.getId(),
    slot1.id,
    [
      new TestShip({ name: "UCS Achilles" }).serialize(),
      new TestShip({ name: "UCS Eclipse" }).serialize(),
    ],
    user
  );

  await controller.buyShips(
    gameData.getId(),
    slot2.id,
    [new TestShip({ name: "GEPS Biliyaz" }).serialize()],
    user2
  );

  const newGameData = await controller.getGameData(gameData.getId());

  const ships = newGameData.ships.getShips();

  expect(ships.length).toBe(3);
  expect(ships[0].id).not.toBe(null);
  expect(ships[1].id).not.toBe(null);
  expect(ships[2].id).not.toBe(null);

  const biliyaz = ships.find((ship) => ship.name === "GEPS Biliyaz");
  const achilles = ships.find((ship) => ship.name === "UCS Achilles");
  const eclipse = ships.find((ship) => ship.name === "UCS Eclipse");

  expect(
    newGameData.slots.getSlotById(slot1.id)!.shipIds.includes(achilles!.id)
  ).toBe(true);
  expect(
    newGameData.slots.getSlotById(slot1.id)!.shipIds.includes(eclipse!.id)
  ).toBe(true);
  expect(
    newGameData.slots.getSlotById(slot2.id)!.shipIds.includes(biliyaz!.id)
  ).toBe(true);

  expect(newGameData.status, "active");
  expect(newGameData.phase, "deployment");
  expect(newGameData.isPlayerActive(user)).toBe(true);
  expect(newGameData.isPlayerActive(user2)).toBe(true);

  expect(biliyaz!.getHexPosition()).toEqual(new Offset(30, 0));
  expect(achilles!.getHexPosition()).toEqual(new Offset(-30, 0));
  expect(eclipse!.getHexPosition()).toEqual(new Offset(-30, 1));

  //expect(eclipse.movement.getMovement().length, 2);
  compareMovements(eclipse!.movement.getMovement(), [
    new MovementOrder(
      null,
      MOVEMENT_TYPE.START,
      new Offset(-30, 1),
      new Offset(30, 0),
      0,
      false,
      1,
      0,
      null,
      1
    ),
    new MovementOrder(
      null,
      MOVEMENT_TYPE.DEPLOY,
      new Offset(-30, 1),
      new Offset(30, 0),
      0,
      false,
      1,
      0,
      null,
      2
    ),
  ]);

  expect(newGameData.isActiveShip(biliyaz!)).toBe(true);
  expect(newGameData.isActiveShip(achilles!)).toBe(true);
  expect(newGameData.isActiveShip(eclipse!)).toBe(true);
});

test("Try to buy too expensive ships", async () => {
  const db = new TestDatabaseConnection("buy_ships");
  await db.resetDatabase();
  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructLobbyGameWithSlotsTaken(
    user,
    user2,
    controller
  );
  const slot1 = gameData.slots.getSlots()[0];

  await expect(() =>
    controller.buyShips(
      gameData.getId(),
      slot1.id,
      [
        new TestShip({ name: "UCS 1" }).serialize(),
        new TestShip({ name: "UCS 2" }).serialize(),
        new TestShip({ name: "UCS 3" }).serialize(),
        new TestShip({ name: "UCS 4" }).serialize(),
        new TestShip({ name: "UCS 5" }).serialize(),
        new TestShip({ name: "UCS 6" }).serialize(),
        new TestShip({ name: "UCS 7" }).serialize(),
        new TestShip({ name: "UCS 8" }).serialize(),
        new TestShip({ name: "UCS 9" }).serialize(),
        new TestShip({ name: "UCS 10" }).serialize(),
        new TestShip({ name: "UCS 11" }).serialize(),
        new TestShip({ name: "UCS 12" }).serialize(),
        new TestShip({ name: "UCS 13" }).serialize(),
      ],
      user
    )
  ).rejects.toThrow("Ships cost 6500 points, but slot has only 3000 points");
});

test("Try to buy ships for wrong slot", async () => {
  const db = new TestDatabaseConnection("buy_ships");
  await db.resetDatabase();
  const controller = new GameController(db);

  const user = User.create(1, "Nönmän");
  const user2 = User.create(2, "Bädmän");

  const gameData = await constructLobbyGameWithSlotsTaken(
    user,
    user2,
    controller
  );
  const slot1 = gameData.slots.getSlots()[0];
  const slot2 = gameData.slots.getSlots()[1];

  await controller.buyShips(
    gameData.getId(),
    slot1.id,
    [
      new TestShip({ name: "UCS Achilles" }).serialize(),
      new TestShip({ name: "UCS Eclipse" }).serialize(),
    ],
    user
  );

  await expect(() =>
    controller.buyShips(
      gameData.getId(),
      slot1.id,
      [new TestShip({ name: "GEPS Biliyaz" }).serialize()],
      user2
    )
  ).rejects.toThrow("Slot taken by other user");
});
