import BoostableSystemStrategy from "./BoostableSystemStrategy";
import { SYSTEM_HANDLERS } from "./types/SystemHandlersTypes";
class BoostablePlusOneOutputSystemStrategy extends BoostableSystemStrategy {
    basePowerRequirement;
    constructor(maxLevel = null, basePowerRequirement = null) {
        super(0, maxLevel);
        this.basePowerRequirement = basePowerRequirement;
    }
    getPowerRequiredForBoost(payload, previousResponse = 0) {
        const output = this.basePowerRequirement !== null
            ? this.basePowerRequirement
            : this.getSystem().callHandler(SYSTEM_HANDLERS.getOutputForBoost, null, 0);
        return output + this.boostLevel + previousResponse + 1;
    }
    getPowerRequirement(payload, previousResponse = 0) {
        if (this.getSystem().isDisabled()) {
            return previousResponse;
        }
        const output = this.basePowerRequirement !== null
            ? this.basePowerRequirement
            : this.getSystem().callHandler(SYSTEM_HANDLERS.getOutputForBoost, null, 0);
        const power = this.boostLevel * output + this.boostLevel;
        return power + previousResponse;
    }
}
export default BoostablePlusOneOutputSystemStrategy;
