import GameData from "../../model/src/game/GameData";
import GameDataRepository from "../repository/GameDataRepository";
import CachedGameData, { ReservedGameDataPromise } from "./CachedGameData";

class GameDataService {
  private gameDataRepository: GameDataRepository;
  private gameDataCache: Record<string, CachedGameData>;

  constructor(gameDataRepository: GameDataRepository) {
    this.gameDataRepository = gameDataRepository;

    this.gameDataCache = {};
  }

  getCachedOptional(id: number): CachedGameData | undefined {
    return this.gameDataCache[id];
  }

  getCached(id: number): CachedGameData {
    let cached = this.gameDataCache[id];
    if (!cached) {
      cached = new CachedGameData(id, this.gameDataRepository);
      this.gameDataCache[id] = cached;
    }

    return cached;
  }

  clearCache(id: number) {
    if (this.gameDataCache[id]) {
      this.gameDataCache[id].destroy();
      delete this.gameDataCache[id];
    }
  }

  async loadGame(id: number): Promise<GameData> {
    try {
      const result = (await this.getCached(id).get()).gameData;
      return result;
    } catch (e) {
      this.clearCache(id);
      throw e;
    }
  }

  async reserveGame(id: number): ReservedGameDataPromise {
    try {
      const result = await this.getCached(id).reserve();
      return result;
    } catch (e) {
      this.clearCache(id);
      throw e;
    }
  }

  async saveGame(key: string, gameDatas: GameData | GameData[]) {
    gameDatas = ([] as GameData[]).concat(gameDatas);
    const id = gameDatas[0].getId();
    try {
      const result = await this.getCached(id).release(key, gameDatas);
      return result;
    } catch (e) {
      this.clearCache(id);
      throw e;
    }
  }

  async releaseGame(key: string, gameId: number) {
    try {
      await this.getCachedOptional(gameId)?.cancel(key);
    } catch (e) {
      this.clearCache(gameId);
      throw e;
    }
  }

  loadReplay(id: number, turn: number) {
    return this.gameDataRepository.loadGame(id, turn);
  }

  async createGame(gameData: GameData): Promise<number> {
    await this.gameDataRepository.saveGame([gameData]);
    return gameData.getId();
  }

  createGames(gameData: GameData[]): Promise<number[]> {
    return this.gameDataRepository.saveGame(gameData);
  }
}

export default GameDataService;
