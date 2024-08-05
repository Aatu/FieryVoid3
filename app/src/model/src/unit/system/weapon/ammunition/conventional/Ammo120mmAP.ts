import Ammo from "../Ammo";

class Ammo120mmAP extends Ammo {
  constructor() {
    super("2d3+5", 10);
  }

  getDisplayName() {
    return "120mm armor piercing railgun projectile";
  }

  getShortDisplayName() {
    return "120mm AP";
  }

  getBackgroundImage() {
    return "/img/ammo/120mmAP.png";
  }

  getIconText() {
    return "AP";
  }
}

export default Ammo120mmAP;
