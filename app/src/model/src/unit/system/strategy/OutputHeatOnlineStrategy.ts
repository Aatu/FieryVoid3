import ShipSystemStrategy from "./ShipSystemStrategy";
import { SYSTEM_HANDLERS } from "./types/SystemHandlersTypes";

class OutputHeatOnlineStrategy extends ShipSystemStrategy {
  private heatOutput: number;
  private heatOutputPerBoostLevel: number;
  private overheatTransferRatio: number;

  constructor(
    heatOutput: number,
    heatOutputPerBoostLevel: number = 1,
    overheatTransferRatio: number = 0.5
  ) {
    super();
    this.heatOutput = heatOutput;
    this.heatOutputPerBoostLevel = heatOutputPerBoostLevel;
    this.overheatTransferRatio = overheatTransferRatio;
  }

  getOverheatTransferRatio(payload: unknown, previousResponse = 0) {
    if (previousResponse && previousResponse < this.overheatTransferRatio) {
      return previousResponse;
    }

    return this.overheatTransferRatio;
  }

  getMessages(payload: unknown, previousResponse = []) {
    return previousResponse;
  }

  generatesHeat() {
    return true;
  }

  getHeatGenerated(payload: unknown, previousResponse = 0) {
    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    const boostLevel = this.getSystem().callHandler(
      SYSTEM_HANDLERS.getBoost,
      null,
      0
    );

    return (
      previousResponse +
      this.heatOutput +
      boostLevel * this.heatOutputPerBoostLevel
    );
  }
}

export default OutputHeatOnlineStrategy;
