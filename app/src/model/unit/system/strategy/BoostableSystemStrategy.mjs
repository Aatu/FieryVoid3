import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class BoostableSystemStrategy extends ShipSystemStrategy {
  constructor(power) {
    super();
    this.power = power || 0;
    if (this.power <= 0) {
      throw new Error("Power must be more than zero");
    }
  }

  canBoost(payload, previousResponse) {
    return true;
  }

  getPowerRequiredForBoost(payload, previousResponse = 0) {
    return this.power + previousResponse;
  }

  boost(payload, previousResponse) {
    //TODO
  }

  deboost(payload, previousResponse) {
    //TODO
  }
}

export default BoostableSystemStrategy;
