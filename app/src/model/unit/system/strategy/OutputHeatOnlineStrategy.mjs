import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class OutputHeatOnlineStrategy extends ShipSystemStrategy {
  constructor(
    heatOutput,
    heatOutputPerBoostLevel = 1,
    overheatTransferRatio = 0.5
  ) {
    super();
    this.heatOutput = heatOutput;
    this.heatOutputPerBoostLevel = heatOutputPerBoostLevel;
    this.overheatTransferRatio = overheatTransferRatio;
  }

  getOverheatTransferRatio(payload, previousResponse = 0) {
    if (previousResponse && previousResponse < this.overheatTransferRatio) {
      return previousResponse;
    }

    return this.overheatTransferRatio;
  }

  getMessages(payload, previousResponse = []) {
    return previousResponse;
  }

  generatesHeat() {
    return true;
  }

  getHeatGenerated(payload, previousResponse = 0) {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    const boostLevel = this.system.callHandler("getBoost", null, 0);

    return (
      previousResponse +
      this.heatOutput +
      boostLevel * this.heatOutputPerBoostLevel
    );
  }
}

export default OutputHeatOnlineStrategy;
