import ShipSystem from "../ShipSystem.mjs";
import { ThrustChannelSystemStrategy } from "../strategy/index.mjs";

class Thruster extends ShipSystem {
  constructor(args, channel, direction) {
    super(args, [new ThrustChannelSystemStrategy(channel, direction)]);
  }

  getDisplayName() {
    return "Thruster";
  }

  getBackgroundImage() {
    if (this.callHandler("isDirection", 3, false)) {
      return "/img/system/thruster2.png";
    } else if (this.callHandler("isDirection", 2, false)) {
      return "/img/system/thruster4.png";
    } else if (this.callHandler("isDirection", 5, false)) {
      return "/img/system/thruster3.png";
    }
    return "/img/system/thruster1.png";
  }
}

export default Thruster;
