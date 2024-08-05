import ShipSystem from "../ShipSystem.mjs";
import { ElectronicWarfareProvider } from "../strategy/index.mjs";
import BoostablePlusOneOutputSystemStrategy from "../strategy/BoostablePlusOneOutputSystemStrategy.mjs";
import RequiresPowerSystemStrategy from "../strategy/RequiresPowerSystemStrategy.mjs";
import OutputHeatOnlineStrategy from "../strategy/OutputHeatOnlineStrategy.mjs";

class EwArray extends ShipSystem {
  constructor(args, output) {
    const {
      heat,
      boostHeat,
      boostable = true,
      power = 5,
      overheatTransferRatio = 0.5,
      boostPower = null,
    } = args;
    super(args, [
      new ElectronicWarfareProvider(output),
      new RequiresPowerSystemStrategy(power),
      new OutputHeatOnlineStrategy(
        heat || Math.ceil(output / 2),
        boostHeat || Math.ceil(output / 3),
        overheatTransferRatio
      ),
    ]);

    if (boostable) {
      this.addStrategy(
        new BoostablePlusOneOutputSystemStrategy(null, boostPower)
      );
    }
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
