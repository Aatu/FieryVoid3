import ShipSystem from "../ShipSystem.mjs";
import { ElectronicWarfareProvider } from "../strategy/index.mjs";
import BoostablePlusOneOutputSystemStrategy from "../strategy/BoostablePlusOneOutputSystemStrategy.mjs";
import RequiresPowerSystemStrategy from "../strategy/RequiresPowerSystemStrategy.mjs";
import OutputHeatOnlineStrategy from "../strategy/OutputHeatOnlineStrategy.mjs";

class EwArray extends ShipSystem {
  constructor(args, output, power = 5) {
    super(args, [
      new ElectronicWarfareProvider(output),
      new BoostablePlusOneOutputSystemStrategy(),
      new RequiresPowerSystemStrategy(power),
      new OutputHeatOnlineStrategy(output, output)
    ]);
  }

  getDisplayName() {
    return "Electronic Warfare array";
  }

  getBackgroundImage() {
    return "/img/system/scanner.png";
  }

  getIconText() {
    return this.callHandler("getUsageVsOutputText");
  }
}

export default EwArray;
