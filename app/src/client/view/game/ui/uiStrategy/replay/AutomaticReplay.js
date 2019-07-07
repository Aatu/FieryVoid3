import UiStrategy from "../UiStrategy";

class AutomaticReplay extends UiStrategy {
  constructor(phaseStrategy, turnLength = 5000) {
    super();
    this.phaseStrategy = phaseStrategy;
    this.turnLenght = turnLength;
    this.length = 0;
  }

  async newTurn(gameDatas) {
    const { shipIconContainer } = this.services;
    const start = gameDatas[0].turn;
    const end = gameDatas[gameDatas.length - 1].turn;
    this.length = end - start;

    await shipIconContainer.shipsLoaded();

    setTimeout(() => {
      this.phaseStrategy.animateFromTo(
        0,
        this.length * this.turnLenght,
        this.turnLenght
      );
    }, 500);
  }

  render({ delta, total }) {
    if (total >= this.length * this.turnLenght) {
      const { uiState } = this.services;
      uiState.closeReplay();
    }
  }
}

export default AutomaticReplay;
