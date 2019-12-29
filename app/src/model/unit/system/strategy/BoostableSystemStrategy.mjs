import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class BoostableSystemStrategy extends ShipSystemStrategy {
  constructor(power = 0, maxLevel = null) {
    super();
    this.power = power;

    this.maxLevel = maxLevel;
    this.boostLevel = 0;
  }

  isBoostable() {
    return true;
  }

  canBoost(payload, previousResponse) {
    const remainginPower = this.system.shipSystems.power.getRemainingPowerOutput();

    if (this.maxLevel !== null && this.boostLevel >= this.maxLevel) {
      return false;
    }

    return remainginPower >= this.getPowerRequiredForBoost();
  }

  getPowerRequiredForBoost(payload, previousResponse = 0) {
    return this.power + previousResponse;
  }

  getBoost(payload, previousResponse = 0) {
    return previousResponse + this.boostLevel;
  }

  getPowerRequirement(payload, previousResponse = 0) {
    const power = this.boostLevel * this.power;
    return power + previousResponse;
  }

  boost(payload, previousResponse) {
    if (!this.canBoost(payload)) {
      return false;
    }

    this.boostLevel++;
  }

  deBoost(payload, previousResponse) {
    if (this.boostLevel === 0) {
      return false;
    }

    this.boostLevel--;
    this.system.callHandler("onSystemPowerLevelDecrease");
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      boostableSystemStrategy: {
        boostLevel: this.boostLevel
      }
    };
  }

  deserialize(data = {}) {
    this.boostLevel = data.boostableSystemStrategy
      ? data.boostableSystemStrategy.boostLevel
      : 0;

    return this;
  }
}

export default BoostableSystemStrategy;
