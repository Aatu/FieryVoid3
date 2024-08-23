import UiStrategy from "./UiStrategy";

class AllowSubmittingOnValidGameState extends UiStrategy {
  deactivate() {
    const { uiState } = this.getServices();
    uiState.setTurnReady(false);
  }

  update(gameData) {
    super.update(gameData);

    const { uiState } = this.getServices();
    uiState.setTurnReady(true);
  }
}

export default AllowSubmittingOnValidGameState;
