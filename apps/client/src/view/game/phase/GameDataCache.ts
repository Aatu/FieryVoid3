import GameData from "@fieryvoid3/model/src/game/GameData";

class GameDataCache {
  private replays: GameData[] = [];
  private currentGameData: GameData | null = null;

  getGameDatasForAutomaticReplay() {
    if (!this.currentGameData) {
      return null;
    }

    const lastGameData = this.replays.find(
      (replay) => replay.turn === this.currentGameData!.turn - 1
    );

    if (!lastGameData) {
      return null;
    }

    return [lastGameData, this.currentGameData];
  }

  setCurrent(gameData: GameData) {
    this.currentGameData = gameData;
  }

  getCurrent() {
    return this.currentGameData;
  }

  setReplays(replays: GameData[]) {
    this.replays = this.replays.filter(
      (replay) => !replays.find((newReplay) => newReplay.turn === replay.turn)
    );

    this.replays = [...this.replays, ...replays];
  }
}

export default GameDataCache;
