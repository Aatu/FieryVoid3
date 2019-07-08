class ShipSystemStrategy {
  constructor() {
    this.system = null;
  }

  init(system) {
    this.system = system;
  }

  hasHandler(name) {
    return Boolean(this[name]);
  }

  callHandler(name, payload = {}, previousResponse) {
    if (!this.hasHandler(name)) {
      return previousResponse;
    }
    return this[name](payload, previousResponse);
  }
}

export default ShipSystemStrategy;
