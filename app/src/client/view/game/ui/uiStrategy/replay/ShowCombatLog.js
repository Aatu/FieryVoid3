import UiStrategy from "../UiStrategy";

class ShowCombatLog extends UiStrategy {
  constructor(replayContext) {
    super();
    this.replayContext = replayContext;
  }

  async newTurn(gameDatas) {
    const { uiState } = this.services;
    uiState.showCombatLog({
      replayContext: this.replayContext,
      gameData: gameDatas[0]
    });
  }

  deactivate() {
    const { uiState } = this.services;
    uiState.showCombatLog(false);
  }
}

export default ShowCombatLog;
