import test from "ava";
import GameController from "../../server/controller/GameController.mjs";
import TestDatabaseConnection from "../support/TestDatabaseConnection.mjs";
import User from "../../model/User";
import GameData from "../../model/game/GameData.mjs";
import GameSlot from "../../model/game/GameSlot.mjs";
import hexagon from "../../model/hexagon";

test.serial("Create game successfull", async test => {
  const db = new TestDatabaseConnection("create_game");
  await db.resetDatabase();

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
      deploymentVector: new hexagon.Offset(30, 0)
    })
  );

  gameData.slots.addSlot(
    new GameSlot({
      name: "United Colonies",
      team: 2,
      points: 3000,
      userId: null,
      deploymentLocation: new hexagon.Offset(30, 0),
      deploymentVector: new hexagon.Offset(-30, 0)
    })
  );

  const controller = new GameController(db);
  const gameId = await controller.createGame(gameData.serialize(), user);
  test.is(gameId, 1);
  const newGameData = await controller.getGameData(gameId);

  test.is(newGameData.id, gameId);
  test.is(newGameData.slots.getSlots().length, 2);
  test.deepEqual(newGameData.slots.serialize(), gameData.slots.serialize());
  test.true(newGameData.players.some(player => player.id === user.id));
  test.true(newGameData.isPlayerActive(user));
});

test("Create game, user is not in a slot", async test => {
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
      deploymentVector: new hexagon.Offset(30, 0)
    })
  );

  gameData.slots.addSlot(
    new GameSlot({
      name: "United Colonies",
      team: 2,
      points: 3000,
      userId: null,
      deploymentLocation: new hexagon.Offset(30, 0),
      deploymentVector: new hexagon.Offset(-30, 0)
    })
  );

  const controller = new GameController(db);

  const error = await test.throwsAsync(() =>
    controller.createGame(gameData.serialize(), user)
  );
  test.is(error.message, "Game creator has to occupy atleast one slot");
});

test("Create game, only one slot", async test => {
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
      deploymentVector: new hexagon.Offset(30, 0)
    })
  );

  const controller = new GameController(db);

  const error = await test.throwsAsync(() =>
    controller.createGame(gameData.serialize(), user)
  );
  test.is(error.message, "Game has to have atleast two slots");
});

test("Create game, multiple users in slots", async test => {
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
      deploymentVector: new hexagon.Offset(30, 0)
    })
  );

  gameData.slots.addSlot(
    new GameSlot({
      name: "United Colonies",
      team: 2,
      points: 3000,
      userId: user2.id,
      deploymentLocation: new hexagon.Offset(30, 0),
      deploymentVector: new hexagon.Offset(-30, 0)
    })
  );

  const controller = new GameController(null);

  const error = await test.throwsAsync(() =>
    controller.createGame(gameData.serialize(), user)
  );
  test.is(error.message, "Other players can not occupy slots at this stage");
});
