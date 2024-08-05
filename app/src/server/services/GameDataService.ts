import CachedGameData from "./CachedGameData.js";

class GameDataService {
  constructor(gameDataRepository) {
    this.gameDataRepository = gameDataRepository;

    this.gameDataCache = {};
  }

  getCached(id) {
    let cached = this.gameDataCache[id];
    if (!cached) {
      cached = new CachedGameData(id, this.gameDataRepository);
      this.gameDataCache[id] = cached;
    }

    return cached;
  }

  clearCache(id) {
    if (this.gameDataCache[id]) {
      this.gameDataCache[id].destroy();
      this.gameDataCache[id] = null;
    }
  }

  async loadGame(id) {
    try {
      const result = await this.getCached(id).get();
      return result;
    } catch (e) {
      this.clearCache(id);
      throw e;
    }
  }

  async reserveGame(id) {
    try {
      const result = await this.getCached(id).reserve();
      return result;
    } catch (e) {
      this.clearCache(id);
      throw e;
    }
  }

  async saveGame(key, gameDatas) {
    gameDatas = [].concat(gameDatas);
    const id = gameDatas[0].id;
    try {
      const result = await this.getCached(id).release(key, gameDatas);
      return result;
    } catch (e) {
      this.clearCache(id);
      throw e;
    }
  }

  async releaseGame(key, gameId) {
    try {
      await this.getCached(gameId).cancel(key);
    } catch (e) {
      this.clearCache(gameId);
      throw e;
    }
  }

  loadReplay(id, turn) {
    return this.gameDataRepository.loadGame(id, turn);
  }

  createGame(gameData) {
    return this.gameDataRepository.saveGame(gameData);
  }
}

export default GameDataService;
