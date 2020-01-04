import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class OutputHeatOnlineStrategy extends ShipSystemStrategy {
  constructor(heatOutput, heatOutputPerBoostLevel = 1) {
    super();
    this.heatOutput = heatOutput;
    this.heatOutputPerBoostLevel = heatOutputPerBoostLevel;
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Generates heat",
      value: `${this.heatOutput} + ${this.heatOutputPerBoostLevel} per boost level`
    });

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
