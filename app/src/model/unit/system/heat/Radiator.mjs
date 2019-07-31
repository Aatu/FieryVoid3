import ShipSystem from "../ShipSystem.mjs";
import { RequiresPowerSystemStrategy } from "../strategy/index.mjs";

class Radiator extends ShipSystem {
  constructor(args) {
    super(args, [new RequiresPowerSystemStrategy(1)]);
  }

  getDisplayName() {
    return "Radiator";
  }

  getBackgroundImage() {
    return "/img/system/radiator.png";
  }

  getIconText() {
    return "";
  }
}

export default Radiator;
