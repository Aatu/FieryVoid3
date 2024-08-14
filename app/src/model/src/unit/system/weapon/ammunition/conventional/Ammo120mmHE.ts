import Ammo from "../Ammo";

class Ammo120mmHE extends Ammo {
  constructor() {
    super("2d4 + 10", 0);
  }

  getDisplayName() {
    return "120mm high explosive railgun projectile";
  }

  getShortDisplayName() {
    return "120mm HE";
  }

  getBackgroundImage() {
    return "/img/ammo/120mmHE.png";
  }

  getIconText() {
    return "HE";
  }
}

export default Ammo120mmHE;
