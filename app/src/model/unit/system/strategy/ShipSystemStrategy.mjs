class ShipSystemStrategy {
  hasHandler(name) {
    return Boolean(this[name]);
  }

  callHandler(name, system, payload = {}, previousResponse) {
    if (!this.hasHandler(name)) {
      return previousResponse;
    }
    return this[name](system, payload, previousResponse);
  }
}

export default ShipSystemStrategy;
