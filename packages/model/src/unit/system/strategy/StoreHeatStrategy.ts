import ShipSystemStrategy from "./ShipSystemStrategy";

class StoreHeatStrategy extends ShipSystemStrategy {
  private heatCapacity: number;

  constructor(heatCapacity: number) {
    super();
    this.heatCapacity = heatCapacity;
  }

  getMessages(payload: unknown, previousResponse = []) {
    return [
      ...previousResponse,
      ...[
        {
          header: "Stores heat without overheating",
          value: `${this.heatCapacity}`,
        },
        {
          header: "Heat stored",
          value: Math.round(this.getSystem().heat.getHeat()),
        },
      ],
    ];
  }

  canStoreHeat() {
    if (this.getSystem().isDisabled()) {
      return false;
    }

    return true;
  }

  getHeatStoreAmount(payload: unknown, previousResponse = 0) {
    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    return previousResponse + this.heatCapacity;
  }
}

export default StoreHeatStrategy;
