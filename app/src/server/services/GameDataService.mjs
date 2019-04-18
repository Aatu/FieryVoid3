class GameDataService {
  constructor(gameDataRepository) {
    this.gameDataRepository = gameDataRepository;
  }

  async loadGame(id, turn = null, phase = null) {
    return this.gameDataRepository.loadGame(id, turn, phase);
  }

  async saveGame(gameData) {
    return this.gameDataRepository.saveGame(gameData);
  }
}

export default GameDataService;
