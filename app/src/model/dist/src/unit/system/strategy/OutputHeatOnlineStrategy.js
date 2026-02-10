import ShipSystemStrategy from "./ShipSystemStrategy";
import { SYSTEM_HANDLERS } from "./types/SystemHandlersTypes";
class OutputHeatOnlineStrategy extends ShipSystemStrategy {
    heatOutput;
    heatOutputPerBoostLevel;
    overheatTransferRatio;
    constructor(heatOutput, heatOutputPerBoostLevel = 1, overheatTransferRatio = 0.5) {
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
        if (this.getSystem().isDisabled()) {
            return previousResponse;
        }
        const boostLevel = this.getSystem().callHandler(SYSTEM_HANDLERS.getBoost, null, 0);
        return (previousResponse +
            this.heatOutput +
            boostLevel * this.heatOutputPerBoostLevel);
    }
}
export default OutputHeatOnlineStrategy;
