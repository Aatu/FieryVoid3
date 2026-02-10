import { EW_TYPE } from "../../../electronicWarfare/electronicWarfareTypes";
import ShipSystem from "../ShipSystem";
import BoostablePlusOneOutputSystemStrategy from "../strategy/BoostablePlusOneOutputSystemStrategy";
import ElectronicWarfareProvider from "../strategy/ElectronicWarfareProvider";
import OutputHeatOnlineStrategy from "../strategy/OutputHeatOnlineStrategy";
import RequiresPowerSystemStrategy from "../strategy/RequiresPowerSystemStrategy";
import { SYSTEM_HANDLERS } from "../strategy/types/SystemHandlersTypes";
class EwArray extends ShipSystem {
    constructor(args, output, ewTypes = [EW_TYPE.OFFENSIVE, EW_TYPE.DEFENSIVE, EW_TYPE.CC]) {
        const { heat, boostHeat, boostable = true, power = 5, overheatTransferRatio = 0.5, boostPower = null, } = args;
        super(args, [
            new ElectronicWarfareProvider(output, ewTypes),
            new RequiresPowerSystemStrategy(power),
            new OutputHeatOnlineStrategy(heat || Math.ceil(output / 2), boostHeat || Math.ceil(output / 3), overheatTransferRatio),
        ]);
        if (boostable) {
            this.addStrategy(new BoostablePlusOneOutputSystemStrategy(null, boostPower));
        }
    }
    getDisplayName() {
        return "Electronic Warfare array";
    }
    getBackgroundImage() {
        return "/img/system/scanner.png";
    }
    getIconText() {
        return this.callHandler(SYSTEM_HANDLERS.getUsageVsOutputText, null, "");
    }
}
export default EwArray;
