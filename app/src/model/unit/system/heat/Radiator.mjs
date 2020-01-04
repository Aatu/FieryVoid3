import ShipSystem from "../ShipSystem.mjs";
import {
  RequiresPowerSystemStrategy,
  LargerHitProfileOnlineSystemStrategy
} from "../strategy/index.mjs";
import RadiateHeatStrategy from "../strategy/RadiateHeatStrategy.mjs";
import ArmorBoostOfflineSystemStrategy from "../strategy/ArmorBoostOfflineSystemStrategy.mjs";

class Radiator extends ShipSystem {
  constructor(args, radiationCapacity = 40, extraProfile = 20, armorBoost = 5) {
    super(args, [
      new RequiresPowerSystemStrategy(1, false),
      new LargerHitProfileOnlineSystemStrategy(extraProfile, extraProfile, 5),
      new RadiateHeatStrategy(radiationCapacity),
      new ArmorBoostOfflineSystemStrategy(armorBoost)
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
