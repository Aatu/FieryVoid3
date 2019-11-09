import dice from "rpg-dice-roller";

class ShipSystemStrategy {
  constructor() {
    this.system = null;
    this.diceRoller = new dice.DiceRoller();
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
