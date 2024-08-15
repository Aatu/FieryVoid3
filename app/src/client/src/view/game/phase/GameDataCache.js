class GameDataCache {
  constructor() {
    this.replays = [];
    this.currentGameData = null;
  }

  getGameDatasForAutomaticReplay() {
    if (!this.currentGameData) {
      return null;
    }

    const lastGameData = this.replays.find(
      replay => replay.turn === this.currentGameData.turn - 1
    );

    if (!lastGameData) {
      return null;
    }

    return [lastGameData, this.currentGameData];
  }

  setCurrent(gameData) {
    this.currentGameData = gameData;
  }

  getCurrent() {
    return this.currentGameData;
  }

  setReplays(replays) {
    this.replays = this.replays.filter(
      replay => !replays.find(newReplay => newReplay.turn === replay.turn)
    );

    this.replays = [...this.replays, ...replays];
  }
}

export default GameDataCache;
