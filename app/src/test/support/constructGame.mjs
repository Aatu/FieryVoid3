import GameData from "../../model/game/GameData.mjs";
import GameSlot from "../../model/game/GameSlot.mjs";
import hexagon from "../../model/hexagon";
import TestShip from "../../model/unit/ships/test/TestShip";
import MovementService from "../../model/movement/MovementService";

export const constructLobbyGame = user => {
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

  return gameData;
};

export const constructLobbyGameWithSlotsTaken = async (
  user1,
  user2,
  controller
) => {
  const gameData = new GameData();
  gameData.name = "Very nice test game";

  const slot1 = gameData.slots.addSlot(
    new GameSlot({
      name: "Great Expanse Protectorate",
      team: 1,
      points: 3000,
      userId: user1.id,
      deploymentLocation: new hexagon.Offset(-30, 0),
      deploymentVector: new hexagon.Offset(30, 0)
    })
  );

  const slot2 = gameData.slots.addSlot(
    new GameSlot({
      name: "United Colonies",
      team: 2,
      points: 3000,
      userId: null,
      deploymentLocation: new hexagon.Offset(30, 0),
      deploymentVector: new hexagon.Offset(-30, 0)
    })
  );

  const gameId = await controller.createGame(gameData.serialize(), user1);
  await controller.takeSlot(gameId, slot2.id, user2);
  const newGameData = await controller.getGameData(gameId);

  return newGameData;
};

export const constructDeploymentGame = async (user1, user2, controller) => {
  const gameData = new GameData();
  gameData.name = "Very nice test game";

  const slot1 = gameData.slots.addSlot(
    new GameSlot({
      name: "Great Expanse Protectorate",
      team: 1,
      points: 3000,
      userId: user1.id,
      deploymentLocation: new hexagon.Offset(-30, 0),
      deploymentVector: new hexagon.Offset(30, 0)
    })
  );

  const slot2 = gameData.slots.addSlot(
    new GameSlot({
      name: "United Colonies",
      team: 2,
      points: 3000,
      userId: null,
      deploymentLocation: new hexagon.Offset(30, 0),
      deploymentVector: new hexagon.Offset(-30, 0)
    })
  );

  const gameId = await controller.createGame(gameData, user1);
  await controller.takeSlot(gameId, slot2.id, user2);
  const newGameData = await controller.getGameData(gameId);

  return newGameData;
};

export const constructShipsBoughtGame = async (user1, user2, controller) => {
  const gameData = await constructLobbyGameWithSlotsTaken(
    user1,
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
    user1
  );

  await controller.buyShips(
    gameData.id,
    slot2.id,
    [new TestShip({ name: "GEPS Biliyaz" }).serialize()],
    user2
  );

  const newGameData = await controller.getGameData(gameData.id);

  return newGameData;
};

export const constructDeployedGame = async (user1, user2, controller) => {
  const gameData = await constructShipsBoughtGame(user1, user2, controller);

  const movementService = new MovementService().update(
    { turn: 1 },
    { relayEvent: () => null }
  );

  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "UCS Achilles"),
    new hexagon.Offset(-32, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "UCS Eclipse"),
    new hexagon.Offset(-34, 3)
  );

  movementService.deploy(
    gameData.ships.getShips().find(ship => ship.name === "GEPS Biliyaz"),
    new hexagon.Offset(34, 0)
  );

  await controller.commitDeployment(gameData.id, gameData.serialize(), user1);
  await controller.commitDeployment(gameData.id, gameData.serialize(), user2);
  const newGameData = await controller.getGameData(gameData.id);

  return newGameData;
};
