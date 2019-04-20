import GameDataService from "../services/GameDataService.mjs";
import GameDataRepository from "../repository/GameDataRepository.mjs";
import CreateGameHandler from "../handler/CreateGameHandler.mjs";
import BuyShipsHandler from "../handler/BuyShipsHandler.mjs";

class GameController {
  constructor(dbConnection) {
    this.gameDataService = new GameDataService(
      new GameDataRepository(dbConnection)
    );

    this.createGameHandler = new CreateGameHandler();
    this.buyShipsHandler = new BuyShipsHandler();
  }

  async createGame(clientGameData, user) {
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
    await this.gameDataService.saveGame(gameData);
  }

  async getGameData(gameId, user) {
    return await this.gameDataService.loadGame(gameId);
  }

  async takeSlot(gameId, slotIndex, user) {
    const gameData = await this.gameDataService.loadGame(gameId);
    this.createGameHandler.takeSlot(gameData, slotIndex, user);
    await this.gameDataService.saveGame(gameData);
  }

  async leaveSlot(gameId, slotIndex, user) {
    const gameData = await this.gameDataService.loadGame(gameId);
    this.createGameHandler.leaveSlot(gameData, slotIndex, user);
    await this.gameDataService.saveGame(gameData);
  }

  async buyShips(gameId, slotIndex, ships, user) {
    const gameData = await this.gameDataService.loadGame(gameId);
    this.buyShipsHandler.buyShips(gameData, slotIndex, ships, user);
    await this.gameDataService.saveGame(gameData);
  }
}

export default GameController;
