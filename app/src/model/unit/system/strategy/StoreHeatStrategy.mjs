import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class StoreHeatStrategy extends ShipSystemStrategy {
  constructor(heatCapacity) {
    super();
    this.heatCapacity = heatCapacity;
  }

  getMessages(payload, previousResponse = []) {
    return [
      ...previousResponse,
      ...[
        {
          header: "Stores heat without overheating",
          value: `${this.heatCapacity}`,
        },
        {
          header: "Heat stored",
          value: Math.round(this.system.heat.getHeat()),
        },
      ],
    ];
  }

  canStoreHeat() {
    if (this.system.isDisabled()) {
      return false;
    }

    return true;
  }

  getHeatStoreAmount(payload, previousResponse) {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    return previousResponse + this.heatCapacity;
  }
}

export default StoreHeatStrategy;
