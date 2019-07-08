import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class AllowsEvasionSystemStrategy extends ShipSystemStrategy {
  constructor(evasion) {
    super();

    this.evasion = evasion || 0;
  }

  getMaxEvasion(payload, previousResponse = 0) {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    return previousResponse + this.evasion;
  }
}

export default AllowsEvasionSystemStrategy;
