class UiStrategy {
  constructor() {
    this.services = null;
    this.gameData = null;
  }

  activate(services) {
    this.services = services;
  }

  update(gameData) {
    this.gameData = gameData;
  }

  stopEvent(payload) {
    payload.stopped = true;
  }
}

export default UiStrategy;
