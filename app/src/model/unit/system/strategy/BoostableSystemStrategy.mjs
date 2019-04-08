import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class BoostableSystemStrategy extends ShipSystemStrategy {
  constructor(power) {
    super();
    this.power = power || 0;
    if (this.power <= 0) {
      throw new Error("Power must be more than zero");
    }
  }

  canBoost(system, payload, previousResponse) {
    return true;
  }

  getPowerRequiredForBoost(system, payload, previousResponse = 0) {
    return this.power + previousResponse;
  }

  boost(system, payload, previousResponse) {
    //TODO
  }

  deboost(system, payload, previousResponse) {
    //TODO
  }
}

export default BoostableSystemStrategy;
