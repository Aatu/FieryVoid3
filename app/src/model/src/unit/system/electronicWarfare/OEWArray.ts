import { EW_TYPE } from "../../../electronicWarfare/electronicWarfareTypes";
import ShipSystem from "../ShipSystem";
import BoostablePlusOneOutputSystemStrategy from "../strategy/BoostablePlusOneOutputSystemStrategy";
import ElectronicWarfareProvider from "../strategy/ElectronicWarfareProvider";
import OutputHeatOnlineStrategy from "../strategy/OutputHeatOnlineStrategy";
import RequiresPowerSystemStrategy from "../strategy/RequiresPowerSystemStrategy";
import { SYSTEM_HANDLERS } from "../strategy/types/SystemHandlersTypes";
import { EWArrayArgs } from "./EwArray";

class OEWArray extends ShipSystem {
  constructor(args: EWArrayArgs, output: number) {
    const {
      heat,
      boostHeat,
      boostable = false,
      power = 5,
      overheatTransferRatio = 0.5,
    } = args;
    super(args, [
      new ElectronicWarfareProvider(output, [EW_TYPE.OFFENSIVE]),
      new RequiresPowerSystemStrategy(power),
      new OutputHeatOnlineStrategy(
        heat || Math.ceil(output / 2),
        boostHeat || Math.ceil(output / 3),
        overheatTransferRatio
      ),
    ]);

    if (boostable) {
      this.addStrategy(new BoostablePlusOneOutputSystemStrategy());
    }
  }

  getDisplayName() {
    return "Offensive Electronic Warfare array";
  }

  getBackgroundImage() {
    return "/img/system/OEWArray.png";
  }

  getIconText() {
    return this.callHandler(SYSTEM_HANDLERS.getUsageVsOutputText, null, "");
  }
}

export default OEWArray;
