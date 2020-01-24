import ShipSystem from "../ShipSystem.mjs";
import { ElectronicWarfareProvider } from "../strategy/index.mjs";
import BoostablePlusOneOutputSystemStrategy from "../strategy/BoostablePlusOneOutputSystemStrategy.mjs";
import RequiresPowerSystemStrategy from "../strategy/RequiresPowerSystemStrategy.mjs";
import OutputHeatOnlineStrategy from "../strategy/OutputHeatOnlineStrategy.mjs";
import * as ewTypes from "../../../electronicWarfare/electronicWarfareTypes.mjs";

class OEWArray extends ShipSystem {
  constructor(args, output) {
    const { heat, boostHeat, boostable = false, power = 5 } = args;
    super(args, [
      new ElectronicWarfareProvider(output, [ewTypes.EW_OFFENSIVE]),
      new RequiresPowerSystemStrategy(power),
      new OutputHeatOnlineStrategy(
        heat || Math.ceil(output / 2),
        boostHeat || Math.ceil(output / 3)
      )
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
    return this.callHandler("getUsageVsOutputText");
  }
}

export default OEWArray;
