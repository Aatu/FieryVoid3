import GameDataService from "../services/GameDataService.mjs";
import GameDataRepository from "../repository/GameDataRepository.mjs";
import GameData from "../../model/game/GameData";
import CreateGameHandler from "../handler/CreateGameHandler.mjs";
import BuyShipsHandler from "../handler/BuyShipsHandler.mjs";
import GameClients from "./GameClients.mjs";
import * as gameMessages from "../../model/game/gameMessage.mjs";

class GameController {
  constructor(dbConnection) {
    this.gameDataService = new GameDataService(
      new GameDataRepository(dbConnection)
    );

    this.gameClients = new GameClients();

    this.createGameHandler = new CreateGameHandler();
    this.buyShipsHandler = new BuyShipsHandler();
  }

  async openConnection(connection, user, gameId) {
    console.log("open connection");
    this.gameClients.subscribeToGame(connection, user, gameId);
    const gameData = await this.gameDataService.loadGame(gameId);
    this.gameClients.sendGameData(gameData, user, connection);
  }

  closeConnection(connection, user, gameId) {
    console.log("close connection");
    this.gameClients.unSubscribeFromGame(connection, gameId);
  }

  async onMessage(message, user, gameId) {
    console.log("MESSAGE RECEIVED");
    console.log(message);

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
        default:
          throw new Error(`Unrecognized message type ${message.type}`);
      }
    } catch (error) {
      //this.gameDataService.releaseGame(gameId);
      throw error;
    }
  }

  async createGame(clientGameData, user) {
    clientGameData = new GameData(clientGameData);
    const serverGameData = this.createGameHandler.createGame(
      clientGameData,
      user
    );

    const gameId = await this.gameDataService.saveGame(serverGameData);
    return gameId;
  }

  async removeGame(gameId, user) {
    const gameData = await this.gameDataService.loadGame(gameId);
    this.createGameHandler.removeGame(gameData, user);
    this.gameClients.sendGameDataAll(gameData);
    await this.gameDataService.saveGame(gameData);
  }

  async getGameData(gameId, user) {
    return await this.gameDataService.loadGame(gameId);
  }

  async takeSlot(gameId, slotId, user) {
    const gameData = await this.gameDataService.loadGame(gameId);
    this.createGameHandler.takeSlot(gameData, slotId, user);
    this.gameClients.sendGameDataAll(gameData);
    await this.gameDataService.saveGame(gameData);
  }

  async leaveSlot(gameId, slotId, user) {
    const gameData = await this.gameDataService.loadGame(gameId);
    this.createGameHandler.leaveSlot(gameData, slotId, user);
    this.gameClients.sendGameDataAll(gameData);
    await this.gameDataService.saveGame(gameData);
  }

  async buyShips(gameId, slotId, ships, user) {
    const gameData = await this.gameDataService.loadGame(gameId);
    this.buyShipsHandler.buyShips(gameData, slotId, ships, user);
    this.gameClients.sendGameDataAll(gameData);
    await this.gameDataService.saveGame(gameData);
  }
}

export default GameController;
