import ShipSystem from "../ShipSystem.mjs";
import { ThrustChannelSystemStrategy } from "../strategy/index.mjs";

class ChemicalThruster extends ShipSystem {
  constructor(args, output, direction) {
    super(args, [new ThrustChannelSystemStrategy(output, direction)]);
  }

  getDisplayName() {
    return "Chemical Thruster";
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

export default ChemicalThruster;
