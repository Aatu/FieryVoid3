import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class BoostableSystemStrategy extends ShipSystemStrategy {
  constructor(power = 0, maxLevel = null) {
    super();
    this.power = power;

    this.maxLevel = maxLevel;
    this.boostLevel = 0;
  }

  isBoostable(payload, previousResponse = true) {
    if (previousResponse === false) {
      return false;
    }

    return this.maxLevel !== 0;
  }

  canBoost(payload, previousResponse = true) {
    if (previousResponse === false) {
      return false;
    }

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
    this.system.callHandler("onSystemPowerLevelIncrease");
  }

  deBoost(payload, previousResponse) {
    if (this.boostLevel === 0) {
      return false;
    }

    this.boostLevel--;
    this.system.callHandler("onSystemPowerLevelDecrease");
  }

  resetBoost() {
    this.boostLevel = 0;
    this.system.callHandler("onSystemPowerLevelDecrease");
  }

  getRequiredPhasesForReceivingPlayerData() {
    return 2;
  }

  receivePlayerData({ clientSystem, phase }) {
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

    if (this.boostLevel > targetBoostlevel && phase === 2) {
      while (true) {
        if (this.boostLevel === targetBoostlevel) {
          return;
        }

        if (!this.canDeBoost()) {
          return;
        }

        this.deBoost();
      }
    } else if (this.boostLevel < targetBoostlevel && phase === 1) {
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

  getTooltipMenuButton({ myShip }, previousResponse = []) {
    if (!myShip) {
      return previousResponse;
    }

    if (this.system.isDisabled() || !this.system.callHandler("isBoostable")) {
      return previousResponse;
    }

    return [
      ...previousResponse,
      {
        sort: 100,
        img: "/img/plus.png",
        onClickHandler: () => this.system.callHandler("boost"),
        disabledHandler: () => !this.system.callHandler("canBoost", null, null),
      },
      {
        sort: 100,
        img: "/img/minus.png",
        onClickHandler: () => this.system.callHandler("deBoost"),
        disabledHandler: () =>
          !this.system.callHandler("canDeBoost", null, null),
      },
    ];
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      boostableSystemStrategy: {
        boostLevel: this.boostLevel,
      },
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
