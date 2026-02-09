import GameData from "../../../model/src/game/GameData";
import GameSlot from "../../../model/src/game/GameSlot";
import Offset from "../../../model/src/hexagon/Offset";
import MovementService from "../../../model/src/movement/MovementService";
import TestShip from "../../../model/src/unit/ships/test/TestShip";
import { User } from "../../../model/src/User/User";
import GameController from "../../controller/GameController";

export const constructLobbyGame = (user: User) => {
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

  return gameData;
};

export const constructLobbyGameWithSlotsTaken = async (
  user1: User,
  user2: User,
  controller: GameController,
  deployOffset1 = new Offset(0, 0),
  deployOffset2 = new Offset(0, 0)
) => {
  const gameData = new GameData();
  gameData.name = "Very nice test game";

  const slot1 = gameData.slots.addSlot(
    new GameSlot(
      {
        name: "Great Expanse Protectorate",
        team: 1,
        points: 3000,
        userId: user1.id,
        deploymentLocation: new Offset(-30, 0).add(deployOffset1),
        deploymentVector: new Offset(30, 0),
      },
      gameData
    )
  );

  const slot2 = gameData.slots.addSlot(
    new GameSlot(
      {
        name: "United Colonies",
        team: 2,
        points: 3000,
        userId: null,
        deploymentLocation: new Offset(30, 0).add(deployOffset2),
        deploymentVector: new Offset(-30, 0),
      },
      gameData
    )
  );

  const gameId = await controller.createGame(gameData.serialize(), user1);
  await controller.takeSlot(gameId, slot2.id, user2);
  const newGameData = await controller.getGameData(gameId);

  return newGameData;
};

export const constructDeploymentGame = async (
  user1: User,
  user2: User,
  controller: GameController
) => {
  const gameData = new GameData();
  gameData.name = "Very nice test game";

  const slot1 = gameData.slots.addSlot(
    new GameSlot(
      {
        name: "Great Expanse Protectorate",
        team: 1,
        points: 3000,
        userId: user1.id,
        deploymentLocation: new Offset(-30, 0),
        deploymentVector: new Offset(30, 0),
      },
      gameData
    )
  );

  const slot2 = gameData.slots.addSlot(
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

  const gameId = await controller.createGame(gameData.serialize(), user1);
  await controller.takeSlot(gameId, slot2.id, user2);
  const newGameData = await controller.getGameData(gameId);

  return newGameData;
};

export const constructShipsBoughtGame = async (
  user1: User,
  user2: User,
  controller: GameController,
  deployOffset1 = new Offset(0, 0),
  deployOffset2 = new Offset(0, 0)
) => {
  const gameData = await constructLobbyGameWithSlotsTaken(
    user1,
    user2,
    controller,
    deployOffset1,
    deployOffset2
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
    user1
  );

  await controller.buyShips(
    gameData.getId(),
    slot2.id,
    [new TestShip({ name: "GEPS Biliyaz" }).serialize()],
    user2
  );

  const newGameData = await controller.getGameData(gameData.getId());

  return newGameData;
};

export const constructDeployedGame = async (
  user1: User,
  user2: User,
  controller: GameController,
  deployOffset1 = new Offset(0, 0),
  deployOffset2 = new Offset(0, 0)
) => {
  const gameData = await constructShipsBoughtGame(
    user1,
    user2,
    controller,
    deployOffset1,
    deployOffset2
  );

  const movementService = new MovementService().update(
    gameData, //{ turn: 1 },
    { relayEvent: () => null }
  );

  const achilles = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Achilles");

  const eclipse = gameData.ships
    .getShips()
    .find((ship) => ship.name === "UCS Eclipse");
  const biliyaz = gameData.ships
    .getShips()
    .find((ship) => ship.name === "GEPS Biliyaz");

  if (!achilles || !eclipse || !biliyaz) {
    throw new Error("Ships not found");
  }

  movementService.deploy(achilles, new Offset(-32, 3).add(deployOffset1));
  movementService.deploy(eclipse, new Offset(-34, 3).add(deployOffset1));
  movementService.deploy(biliyaz, new Offset(34, 0).add(deployOffset2));

  await controller.commitDeployment(
    gameData.getId(),
    gameData.serialize(),
    user1
  );
  await controller.commitDeployment(
    gameData.getId(),
    gameData.serialize(),
    user2
  );
  const newGameData = await controller.getGameData(gameData.getId());

  return newGameData;
};
