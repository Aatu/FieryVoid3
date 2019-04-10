import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class AllowsEvasionSystemStrategy extends ShipSystemStrategy {
  constructor(evasion) {
    super();

    this.evasion = evasion || 0;
  }

  getMaxEvasion(system, payload, previousResponse = 0) {
    if (system.isDisabled()) {
      return previousResponse;
    }

    return previousResponse + this.evasion;
  }
}

export default AllowsEvasionSystemStrategy;
