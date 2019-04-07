class ShipSystemStrategy {
  constructor(handlers = {}) {
    this.handlers = handlers;
  }

  addHandler(name, handler) {
    if (this.handlers[name]) {
      throw new Error("ShipSystemStrategy duplicate handler!");
    }
    this.handlers[name] = handler;

    return this;
  }

  hasHandler(name) {
    return Boolean(this.handlers[name]);
  }

  callHandler(name, system, payload = {}, previousResponse = {}) {
    if (!this.hasHandler(name)) {
      return previousResponse;
    }
    return this.handlers[name](system, payload, previousResponse);
  }
}

export default ShipSystemStrategy;
