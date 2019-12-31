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

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Boostable",
      value: "Boost with additional power"
    });

    previousResponse.push({
      header: "Current boost level",
      value: this.boostLevel
    });

    return previousResponse;
  }

  canBoost(payload, previousResponse) {
    const remainginPower = this.system.shipSystems.power.getRemainingPowerOutput();

    if (this.system.isDisabled()) {
      return false;
    }

    if (this.maxLevel !== null && this.boostLevel >= this.maxLevel) {
      return false;
    }

    return remainginPower >= this.getPowerRequiredForBoost();
  }

  canDeBoost(payload, previousResponse) {
    return this.boostLevel > 0;
  }

  getPowerRequiredForBoost(payload, previousResponse = 0) {
    return this.power + previousResponse;
  }

  getBoost(payload, previousResponse = 0) {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    return previousResponse + this.boostLevel;
  }

  getPowerRequirement(payload, previousResponse = 0) {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

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

  receivePlayerData({ clientShip, clientSystem }) {
    if (!clientSystem) {
      return;
    }

    if (this.system.isDisabled()) {
      return;
    }

    const clientStrategy = clientSystem.getStrategiesByInstance(
      BoostableSystemStrategy
    )[0];

    const targetBoostlevel = clientStrategy.boostLevel;

    if (this.boostLevel > targetBoostlevel) {
      while (true) {
        if (this.boostLevel === targetBoostlevel) {
          return;
        }

        if (!this.canDeBoost()) {
          return;
        }

        this.deBoost();
      }
    } else if (this.boostLevel < targetBoostlevel) {
      while (true) {
        if (this.boostLevel === targetBoostlevel) {
          return;
        }

        if (!this.canBoost()) {
          return;
        }

        this.boost();
      }
    }
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
