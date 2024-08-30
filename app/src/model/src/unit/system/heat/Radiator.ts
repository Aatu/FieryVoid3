import ShipSystem, { SystemArgs } from "../ShipSystem";
import AlwaysTargetableSystemStrategy from "../strategy/AlwaysTargetableSystemStrategy";
import InternalSystemWhenOfflineSystemStrategy from "../strategy/InternalSystemWhenOfflineSystemStrategy";
import LargerHitProfileOnlineSystemStrategy from "../strategy/LargerHitProfileOnlineSystemStrategy";
import RadiateHeatStrategy from "../strategy/RadiateHeatStrategy";
import RequiresPowerSystemStrategy from "../strategy/RequiresPowerSystemStrategy";

class Radiator extends ShipSystem {
  constructor(
    args: SystemArgs,
    radiationCapacity = 40,
    extraProfile = 20,
    armorBoost = 5
  ) {
    super(args, [
      new RequiresPowerSystemStrategy(1, false),
      new LargerHitProfileOnlineSystemStrategy(extraProfile, extraProfile, 5),
      new RadiateHeatStrategy(radiationCapacity),
      new InternalSystemWhenOfflineSystemStrategy(armorBoost),
      new AlwaysTargetableSystemStrategy(2),
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
