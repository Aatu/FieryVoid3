import Ammo from "../Ammo.mjs";

class Ammo140mmAP extends Ammo {
  constructor() {
    super("2d3+6", 12);
  }

  getDisplayName() {
    return "140mm armor piercing railgun projectile";
  }

  getShortDisplayName() {
    return "140mm AP";
  }

  getBackgroundImage() {
    return "/img/ammo/140mmAP.png";
  }
}

export default Ammo140mmAP;
