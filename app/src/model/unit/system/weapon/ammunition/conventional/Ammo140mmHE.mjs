import Ammo from "../Ammo.mjs";

class Ammo140mmHE extends Ammo {
  constructor() {
    super("2d5 + 10", 0);
  }

  getDisplayName() {
    return "140mm high explosive railgun projectile";
  }

  getShortDisplayName() {
    return "140mm HE";
  }

  getBackgroundImage() {
    return "/img/ammo/140mmHE.png";
  }

  getIconText() {
    return "HE";
  }
}

export default Ammo140mmHE;
