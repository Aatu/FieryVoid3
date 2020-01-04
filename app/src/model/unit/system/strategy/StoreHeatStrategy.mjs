import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class StoreHeatStrategy extends ShipSystemStrategy {
  constructor(heatCapacity) {
    super();
    this.heatCapacity = heatCapacity;
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Stores heat without overheating",
      value: `${this.heatCapacity}`
    });

    return previousResponse;
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
