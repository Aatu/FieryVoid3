import { InvalidGameDataError, UnauthorizedError } from "../errors/index.mjs";

class ReplayHandler {
  constructor(gameDataService) {
    this.gameDataService = gameDataService;
  }

  async requestReplay(gameId, start = 1, end = null, user) {
    const gameData = await this.gameDataService.loadGame(gameId);
    const gameDatas = [];
    let currentTurn = start;

    if (end === null) {
      end = gameData.turn;
    }

    if (start > gameData.turn || start >= end || end === 0) {
      throw new InvalidGameDataError(
        `invalid start or end for replay. start: '${start}', end: '${end}'`
      );
    }

    while (currentTurn <= end) {
      let replay = await this.gameDataService.loadReplay(gameId, currentTurn);
      gameDatas.push(replay);
      currentTurn++;
    }

    return gameDatas;
  }
}

export default ReplayHandler;
