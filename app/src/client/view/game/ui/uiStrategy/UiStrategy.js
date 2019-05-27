class UiStrategy {
  constructor() {
    this.services = null;
    this.gamedata = null;
  }

  activate(services) {
    this.services = services;
  }

  update(gamedata) {
    this.gamedata = gamedata;
  }

  stopEvent(payload) {
    payload.stopped = true;
  }
}

export default UiStrategy;
