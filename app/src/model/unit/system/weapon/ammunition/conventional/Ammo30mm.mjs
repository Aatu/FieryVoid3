import Ammo from "../Ammo.mjs";

class Ammo30mm extends Ammo {
  constructor() {
    super("d2", "d3+2");
  }

  getSpaceRequired() {
    return 0.01;
  }

  getDisplayName() {
    return "30mm PDC shell";
  }

  getShortDisplayName() {
    return "30mm";
  }

  getBackgroundImage() {
    return "/img/ammo/30mm.png";
  }
}

export default Ammo30mm;
