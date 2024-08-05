import BoostableSystemStrategy from "./BoostableSystemStrategy.js";

class BoostablePlusOneOutputSystemStrategy extends BoostableSystemStrategy {
  constructor(maxLevel = null, basePowerRequirement = null) {
    super(0, maxLevel);
    this.basePowerRequirement = basePowerRequirement;
  }

  getPowerRequiredForBoost(payload, previousResponse = 0) {
    const output =
      this.basePowerRequirement !== null
        ? this.basePowerRequirement
        : this.system.callHandler("getOutputForBoost", null, 0);
    return output + this.boostLevel + previousResponse + 1;
  }

  getPowerRequirement(payload, previousResponse = 0) {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    const output =
      this.basePowerRequirement !== null
        ? this.basePowerRequirement
        : this.system.callHandler("getOutputForBoost", null, 0);
    const power = this.boostLevel * output + this.boostLevel;
    return power + previousResponse;
  }
}

export default BoostablePlusOneOutputSystemStrategy;
