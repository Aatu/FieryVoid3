import ShipSystem from "../ShipSystem.mjs";
import { ThrustChannelSystemStrategy } from "../strategy";

class Thruster extends ShipSystem {
  constructor(args, channel, direction) {
    super(args, [new ThrustChannelSystemStrategy(channel, direction)]);
  }

  getDisplayName() {
    return "Thruster";
  }

  getBackgroundImage() {
    return "/img/system/thruster1.png";
  }

  getIconText() {
    return this.callHandler("getThrustChannel");
  }
}

export default Thruster;
