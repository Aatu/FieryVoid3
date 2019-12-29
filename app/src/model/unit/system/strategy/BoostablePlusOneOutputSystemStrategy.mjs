import BoostableSystemStrategy from "./BoostableSystemStrategy.mjs";

class BoostablePlusOneOutputSystemStrategy extends BoostableSystemStrategy {
  constructor(maxLevel) {
    super(0, maxLevel);
  }

  getPowerRequiredForBoost(payload, previousResponse = 0) {
    const output = this.system.callHandler("getOutputForBoost", null, 0);
    return output + this.boostLevel + previousResponse + 1;
  }

  getPowerRequirement(payload, previousResponse = 0) {
    const output = this.system.callHandler("getOutputForBoost", null, 0);
    const power = this.boostLevel * output + this.boostLevel;
    return power + previousResponse;
  }
}

export default BoostablePlusOneOutputSystemStrategy;
