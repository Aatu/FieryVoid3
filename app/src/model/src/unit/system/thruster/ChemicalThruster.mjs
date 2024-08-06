import ShipSystem from "../ShipSystem.mjs";
import { ThrustChannelSystemStrategy } from "../strategy/index.mjs";
import { THRUSTER_MODE_CHEMICAL } from "../strategy/ThrustChannelSystemStrategy.js";

class ChemicalThruster extends ShipSystem {
  constructor(args, output, direction) {
    super(args, [
      new ThrustChannelSystemStrategy(
        output,
        direction,
        {},
        THRUSTER_MODE_CHEMICAL
      ),
    ]);
  }

  getDisplayName() {
    return "Chemical Thruster";
  }

  getBackgroundImage() {
    return this.callHandler("getBackgroundImage");
  }
}

export default ChemicalThruster;
