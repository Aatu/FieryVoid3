import Animation from "../Animation";
import Vector from "../../../../../model/utils/Vector";
import ExplosionEffect from "../effect/ExplosionEffect";

class ShipWeaponAnimation extends Animation {
  constructor(getRandom) {
    super(getRandom);
  }

  getLocationForSystem(system, icon) {
    const location = icon.systemLocations[system.id];

    if (!location) {
      return new Vector();
    }

    return location;
  }
}

export default ShipWeaponAnimation;
