import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class RequiresPowerSystemStrategy extends ShipSystemStrategy {
  constructor(power) {
    super();
    this.power = power || 0;
    if (this.power <= 0) {
      throw new Error("Power must be more than zero");
    }
  }

  getPowerRequirement(payload, previousResponse = 0) {
    return this.power + previousResponse;
  }

  canSetOffline(payload, previousResponse = false) {
    return true;
  }
}

export default RequiresPowerSystemStrategy;
