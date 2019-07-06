import UiStrategy from "./UiStrategy";

class AllowSubmittingOnValidGameState extends UiStrategy {
  deactivate() {
    const { uiState } = this.services;
    uiState.setTurnReady(false);
  }

  update(gameData) {
    super.update(gameData);
    uiState.setTurnReady(result);
  }
}

export default AllowSubmittingOnValidGameState;
