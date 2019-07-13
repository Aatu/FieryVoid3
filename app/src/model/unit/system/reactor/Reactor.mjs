import ShipSystem from "../ShipSystem.mjs";
import { PowerOutputSystemStrategy } from "../strategy/index.mjs";

class Reactor extends ShipSystem {
  constructor(args, output) {
    super(args, [new PowerOutputSystemStrategy(output)]);
  }

  getDisplayName() {
    return "Reactor";
  }

  getBackgroundImage() {
    return "/img/system/reactor.png";
  }

  getIconText() {
    return this.callHandler("getPowerOutput");
  }
}

export default Reactor;
