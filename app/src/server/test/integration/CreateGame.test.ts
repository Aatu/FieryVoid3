import { expect, test } from "vitest";
import TestDatabaseConnection from "../support/TestDatabaseConnection";
import { User } from "../../../model/src/User/User";
import GameData from "../../../model/src/game/GameData";
import GameSlot from "../../../model/src/game/GameSlot";
import Offset from "../../../model/src/hexagon/Offset";
import GameController from "../../controller/GameController";

test("Create game successfull", async () => {
  const db = new TestDatabaseConnection("create_game");
  await db.resetDatabase();

  const user = new User({ id: 1, username: "Nönmän" });

  const gameData = new GameData();
  gameData.name = "Very nice test game";

  gameData.slots.addSlot(
    new GameSlot(
      {
        name: "Great Expanse Protectorate",
        team: 1,
        points: 3000,
        userId: user.id,
        deploymentLocation: new Offset(-30, 0),
        deploymentVector: new Offset(30, 0),
      },
      gameData
    )
  );

  gameData.slots.addSlot(
    new GameSlot(
      {
        name: "United Colonies",
        team: 2,
        points: 3000,
        userId: null,
        deploymentLocation: new Offset(30, 0),
        deploymentVector: new Offset(-30, 0),
      },
      gameData
    )
  );

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData.serialize(), user);
  expect(gameId).toBe(1);

  const newGameData = await controller.getGameData(gameId);

  expect(newGameData.id).toBe(gameId);
  expect(newGameData.slots.getSlots().length).toBe(2);
  expect(newGameData.slots.serialize()).toEqual(gameData.slots.serialize());
  expect(newGameData.players.some((player) => player.id === user.id)).toBe(
    true
  );
  expect(newGameData.isPlayerActive(user)).toBe(true);
});

/*
test("Create game, user is not in a slot", async (test) => {
  const db = new TestDatabaseConnection();
  const user = new User(1, "Nönmän");

  const gameData = new GameData();
  gameData.name = "Very nice test game";

  gameData.slots.addSlot(
    new GameSlot({
      name: "Great Expanse Protectorate",
      team: 1,
      points: 3000,
      userId: null,
      deploymentLocation: new hexagon.Offset(-30, 0),
      deploymentVector: new hexagon.Offset(30, 0),
    })
  );

  gameData.slots.addSlot(
    new GameSlot({
      name: "United Colonies",
      team: 2,
      points: 3000,
      userId: null,
      deploymentLocation: new hexagon.Offset(30, 0),
      deploymentVector: new hexagon.Offset(-30, 0),
    })
  );

  const controller = new GameController(db);

  const error = await test.throwsAsync(() =>
    controller.createGame(gameData.serialize(), user)
  );
  test.is(error.message, "Game creator has to occupy atleast one slot");
});

test("Create game, only one slot", async (test) => {
  const db = new TestDatabaseConnection();
  const user = new User(1, "Nönmän");

  const gameData = new GameData();
  gameData.name = "Very nice test game";

  gameData.slots.addSlot(
    new GameSlot({
      name: "Great Expanse Protectorate",
      team: 1,
      points: 3000,
      userId: user.id,
      deploymentLocation: new hexagon.Offset(-30, 0),
      deploymentVector: new hexagon.Offset(30, 0),
    })
  );

  const controller = new GameController(db);

  const error = await test.throwsAsync(() =>
    controller.createGame(gameData.serialize(), user)
  );
  test.is(error.message, "Game has to have atleast two slots");
});

test("Create game, multiple users in slots", async (test) => {
  const user = new User(1, "Nönmän");
  const user2 = new User(2, "Bädmän");

  const gameData = new GameData();
  gameData.name = "Very nice test game";

  gameData.slots.addSlot(
    new GameSlot({
      name: "Great Expanse Protectorate",
      team: 1,
      points: 3000,
      userId: user.id,
      deploymentLocation: new hexagon.Offset(-30, 0),
      deploymentVector: new hexagon.Offset(30, 0),
    })
  );

  gameData.slots.addSlot(
    new GameSlot({
      name: "United Colonies",
      team: 2,
      points: 3000,
      userId: user2.id,
      deploymentLocation: new hexagon.Offset(30, 0),
      deploymentVector: new hexagon.Offset(-30, 0),
    })
  );

  const controller = new GameController(null);

  const error = await test.throwsAsync(() =>
    controller.createGame(gameData.serialize(), user)
  );
  test.is(error.message, "Other players can not occupy slots at this stage");
});
*/
