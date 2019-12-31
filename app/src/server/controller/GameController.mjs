import GameDataService from "../services/GameDataService.mjs";
import GameDataRepository from "../repository/GameDataRepository.mjs";
import GameData from "../../model/game/GameData.mjs";
import CreateGameHandler from "../handler/CreateGameHandler.mjs";
import BuyShipsHandler from "../handler/BuyShipsHandler.mjs";
import DeploymentHandler from "../handler/DeploymentHandler.mjs";
import GameHandler from "../handler/GameHandler.mjs";
import GameClients from "./GameClients.mjs";
import * as gameMessages from "../../model/game/gameMessage.mjs";
import * as gamePhases from "../../model/game/gamePhases.mjs";
import ReplayHandler from "../handler/ReplayHandler.mjs";

class GameController {
  constructor(dbConnection) {
    this.gameDataService = new GameDataService(
      new GameDataRepository(dbConnection)
    );

    this.gameClients = new GameClients();

    this.createGameHandler = new CreateGameHandler();
    this.buyShipsHandler = new BuyShipsHandler();
    this.deploymentHandler = new DeploymentHandler();
    this.gameHandler = new GameHandler();
    this.replayHandler = new ReplayHandler(this.gameDataService);
  }

  async openConnection(connection, user, gameId) {
    this.gameClients.subscribeToGame(connection, user, gameId);
    const gameData = await this.gameDataService.loadGame(gameId);
    if (gameData.turn > 1) {
      const gameDatas = await this.replayHandler.requestReplay(
        gameId,
        gameData.turn - 1,
        gameData.turn
      );

      this.gameClients.sendReplay(gameDatas, user, connection);
    }

    this.gameClients.sendGameData(gameData, user, connection);
  }

  closeConnection(connection, user, gameId) {
    this.gameClients.unSubscribeFromGame(connection, gameId);
  }

  async onMessage(message, user, gameId) {
    try {
      switch (message.type) {
        case gameMessages.MESSAGE_TAKE_SLOT:
          return this.takeSlot(gameId, message.payload, user);
        case gameMessages.MESSAGE_LEAVE_SLOT:
          return this.leaveSlot(gameId, message.payload, user);
        case gameMessages.MESSAGE_BUY_SHIPS:
          return this.buyShips(
            gameId,
            message.payload.slotId,
            message.payload.ships,
            user
          );
        case gameMessages.MESSAGE_COMMIT_DEPLOYMENT:
          return this.commitDeployment(gameId, message.payload, user);
        case gameMessages.MESSAGE_COMMIT_TURN:
          return this.commitTurn(gameId, message.payload, user);
        case gameMessages.MESSAGE_REQUEST_REPLAY:
          return this.requestReplay(gameId, message.payload, user);
        default:
          throw new Error(`Unrecognized message type ${message.type}`);
      }
    } catch (error) {
      throw error;
    }
  }

  async requestReplay(gameId, { start = null, end = null }, user) {
    const gameDatas = this.replayHandler.requestReplay(gameId, start, end);

    this.gameClients.sendReplay(gameDatas, user);
  }

  async createGame(clientGameData, user) {
    clientGameData = new GameData(clientGameData);
    const serverGameData = this.createGameHandler.createGame(
      clientGameData,
      user
    );

    const gameId = await this.gameDataService.createGame(serverGameData);
    return gameId;
  }

  async removeGame(gameId, user) {
    const { key, gameData } = await this.gameDataService.reserveGame(gameId);
    this.createGameHandler.removeGame(gameData, user);
    this.gameClients.sendGameDataAll(gameData);
    await this.gameDataService.saveGame(key, gameData);
  }

  async getGameData(gameId, user) {
    const game = await this.gameDataService.loadGame(gameId);
    return game.censorForUser(user);
  }

  async takeSlot(gameId, slotId, user) {
    const { key, gameData } = await this.gameDataService.reserveGame(gameId);
    this.createGameHandler.takeSlot(gameData, slotId, user);
    this.gameClients.sendGameDataAll(gameData);
    await this.gameDataService.saveGame(key, gameData);
  }

  async leaveSlot(gameId, slotId, user) {
    const { key, gameData } = await this.gameDataService.reserveGame(gameId);
    this.createGameHandler.leaveSlot(gameData, slotId, user);
    this.gameClients.sendGameDataAll(gameData);
    await this.gameDataService.saveGame(key, gameData);
  }

  async buyShips(gameId, slotId, ships, user) {
    const { key, gameData } = await this.gameDataService.reserveGame(gameId);
    this.buyShipsHandler.buyShips(gameData, slotId, ships, user);
    this.gameClients.sendGameDataAll(gameData);
    await this.gameDataService.saveGame(key, gameData);
  }

  async commitDeployment(gameId, clientGameData, user) {
    clientGameData = new GameData(clientGameData);
    const {
      key,
      gameData: serverGameData
    } = await this.gameDataService.reserveGame(gameId);

    this.deploymentHandler.deploy(serverGameData, clientGameData, user);

    this.gameClients.sendGameDataAll(serverGameData);
    await this.gameDataService.saveGame(key, serverGameData);
  }

  async commitTurn(gameId, clientGameData, user) {
    clientGameData = new GameData(clientGameData);
    const {
      key,
      gameData: serverGameData
    } = await this.gameDataService.reserveGame(gameId);

    const toSave = [];
    const toSend = [];

    this.gameHandler.submit(serverGameData, clientGameData, user);
    toSave.push(serverGameData.clone());

    if (this.gameHandler.isReady(serverGameData)) {
      toSave.push(this.gameHandler.advance(serverGameData));
      toSave.push(serverGameData);

      await this.gameDataService.saveGame(key, toSave);

      const turn = serverGameData.turn;
      const replays = await this.replayHandler.requestReplay(
        gameId,
        turn - 1,
        turn
      );

      this.gameClients.sendTurnChange(replays);
    } else {
      toSend.push(serverGameData.clone());
      //TODO: toSend is not actually sent anywhere here
      await this.gameDataService.saveGame(key, toSave);
    }

    return toSend;
  }
}

export default GameController;
