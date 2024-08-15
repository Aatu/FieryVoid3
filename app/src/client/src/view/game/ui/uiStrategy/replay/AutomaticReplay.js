import UiStrategy from "../UiStrategy";

class AutomaticReplay extends UiStrategy {
  constructor(phaseStrategy, replayContext) {
    super();
    this.phaseStrategy = phaseStrategy;
    this.replayContext = replayContext;
  }

  async newTurn(gameDatas) {
    const { shipIconContainer } = this.services;

    await shipIconContainer.shipsLoaded();

    setTimeout(() => {
      this.phaseStrategy.animateFromTo(0);
    }, 500);
  }

  render({ delta, total }) {
    if (total >= this.replayContext.getTurnLength() + 2000) {
      const { uiState } = this.services;
      uiState.closeReplay();
    }
  }
}

export default AutomaticReplay;
