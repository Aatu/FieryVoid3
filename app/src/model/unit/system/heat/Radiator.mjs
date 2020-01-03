import ShipSystem from "../ShipSystem.mjs";
import {
  RequiresPowerSystemStrategy,
  LargerHitProfileOnlineSystemStrategy
} from "../strategy/index.mjs";

class Radiator extends ShipSystem {
  constructor(args, extraProfile = 20) {
    super(args, [
      new RequiresPowerSystemStrategy(1),
      new LargerHitProfileOnlineSystemStrategy(extraProfile, extraProfile, 5)
    ]);
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
