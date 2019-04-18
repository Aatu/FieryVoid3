import GameDataService from "../services/GameDataService.mjs";
import GameDataRepository from "../repository/GameDataRepository.mjs";
import CreateGameHandler from "../handler/CreateGameHandler.mjs";

class GameController {
  constructor(dbConnection) {
    this.gameDataService = new GameDataService(
      new GameDataRepository(dbConnection)
    );

    this.createGameHandler = new CreateGameHandler();
  }

  async createGame(clientGameData, user) {
    const serverGameData = this.createGameHandler.createGame(
      clientGameData,
      user
    );

    const gameId = await this.gameDataService.saveGame(serverGameData);
  }

  async getGameData(gameId, user) {
    return this.gameDataService.loadGame(gameId);
  }
}

export default GameController;
