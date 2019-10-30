import Animation from "../Animation";
import Vector from "../../../../../model/utils/Vector";

class ShipWeaponAnimation extends Animation {
  constructor(getRandom) {
    super();
    this.getRandom = getRandom;
  }

  getRandomPosition(distance) {
    return new Vector(
      this.getRandom() * distance - distance * 0.5,
      this.getRandom() * distance - distance * 0.5,
      this.getRandom() * distance - distance * 0.5
    );
  }
}

export default ShipWeaponAnimation;
