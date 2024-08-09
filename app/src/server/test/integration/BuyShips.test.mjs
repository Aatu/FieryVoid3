import test from "ava";
import GameController from "../../server/controller/GameController";
import TestDatabaseConnection from "../support/TestDatabaseConnection";
import User from "../../model/User";
import { constructLobbyGameWithSlotsTaken } from "../support/constructGame";
import TestShip from "../../model/unit/ships/test/TestShip";
import hexagon from "../../model/hexagon";
import MovementOrder from "../../model/movement/MovementOrder";
import movementTypes from "../../model/movement/movementTypes";
import Impetous from "../../model/unit/ships/federation/Impetous";
import Torpedo158MSV from "../../model/unit/system/weapon/ammunition/torpedo/Torpedo158MSV";

const compareMovements = (test, moves1, moves2) => {
  test.deepEqual(
    moves1.map((move) =>
      move.clone().setRequiredThrust(null).setId(null).round()
    ),
    moves2.map((move) =>
      move.clone().setRequiredThrust(null).setId(null).round()
    )
  );
};

test.serial("Buy ships for first player", async (test) => {
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
      new TestShip({ name: "UCS Eclipse" }).serialize(),
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

  test.is(ships[0].movement.getDeployMove().index, 2);
  test.is(ships[0].movement.getStartMove().index, 1);
});

test.serial("Buy ships for player that is in multiple slots", async (test) => {
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
      new TestShip({ name: "UCS Eclipse" }).serialize(),
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

test.serial("Buy ships for both players", async (test) => {
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
      new TestShip({ name: "UCS Eclipse" }).serialize(),
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

  const biliyaz = ships.find((ship) => ship.name === "GEPS Biliyaz");
  const achilles = ships.find((ship) => ship.name === "UCS Achilles");
  const eclipse = ships.find((ship) => ship.name === "UCS Eclipse");

  test.true(
    newGameData.slots.getSlotById(slot1.id).shipIds.includes(achilles.id)
  );
  test.true(
    newGameData.slots.getSlotById(slot1.id).shipIds.includes(eclipse.id)
  );
  test.true(
    newGameData.slots.getSlotById(slot2.id).shipIds.includes(biliyaz.id)
  );

  test.is(newGameData.status, "active");
  test.is(newGameData.phase, "deployment");
  test.true(newGameData.isPlayerActive(user));
  test.true(newGameData.isPlayerActive(user2));

  test.deepEqual(biliyaz.getHexPosition(), new hexagon.Offset(30, 0));
  test.deepEqual(achilles.getHexPosition(), new hexagon.Offset(-30, 0));
  test.deepEqual(eclipse.getHexPosition(), new hexagon.Offset(-30, 1));

  //test.is(eclipse.movement.getMovement().length, 2);
  compareMovements(test, eclipse.movement.getMovement(), [
    new MovementOrder(
      null,
      movementTypes.START,
      new hexagon.Offset(-30, 1),
      new hexagon.Offset(30, 0),
      0,
      false,
      1,
      0,
      null,
      1
    ),
    new MovementOrder(
      null,
      movementTypes.DEPLOY,
      new hexagon.Offset(-30, 1),
      new hexagon.Offset(30, 0),
      0,
      false,
      1,
      0,
      null,
      2
    ),
  ]);

  test.true(newGameData.isActiveShip(biliyaz));
  test.true(newGameData.isActiveShip(achilles));
  test.true(newGameData.isActiveShip(eclipse));
});

test.serial("Try to buy too expensive ships", async (test) => {
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

  const error = await test.throwsAsync(() =>
    controller.buyShips(
      gameData.id,
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
  );
  test.is(
    error.message,
    "Ships cost 6500 points, but slot has only 3000 points"
  );
});

test.serial("Try to buy ships for wrong slot", async (test) => {
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
      new TestShip({ name: "UCS Eclipse" }).serialize(),
    ],
    user
  );

  const error = await test.throwsAsync(() =>
    controller.buyShips(
      gameData.id,
      slot1.id,
      [new TestShip({ name: "GEPS Biliyaz" }).serialize()],
      user2
    )
  );
  test.is(error.message, "Slot taken by other user");
});

test.serial("Ship loadout is set", async (test) => {
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
    [new Impetous({ name: "UCS Achilles" }).serialize()],
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
  const achilles = ships.find((ship) => ship.name === "UCS Achilles");
  const cargoBay = achilles.systems.getSystemById(204);

  test.true(
    cargoBay.callHandler("hasCargo", {
      object: new Torpedo158MSV(),
      amount: 12,
    })
  );
});
