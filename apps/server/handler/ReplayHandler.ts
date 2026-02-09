import GameData from "../../model/src/game/GameData";
import { InvalidGameDataError, UnauthorizedError } from "../errors/index";
import GameDataService from "../services/GameDataService";

class ReplayHandler {
  private gameDataService: GameDataService;

  constructor(gameDataService: GameDataService) {
    this.gameDataService = gameDataService;
  }

  async requestReplay(
    gameId: number,
    start: number = 1,
    end: number | null = null
  ) {
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
      replay.turn = currentTurn;
      gameDatas.push(replay);
      currentTurn++;
    }

    return gameDatas;
  }
}

export default ReplayHandler;
