import GameData from "../../model/game/GameData.mjs";
import GameSlot from "../../model/game/GameSlot.mjs";
import hexagon from "../../model/hexagon";

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
