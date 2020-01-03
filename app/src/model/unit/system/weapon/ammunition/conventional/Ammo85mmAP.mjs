import Ammo from "../Ammo.mjs";

class Ammo85mmAP extends Ammo {
  constructor() {
    super("d3", "2d3+2");
  }

  getSpaceRequired() {
    return 0.02;
  }

  getDisplayName() {
    return "85mm armor piercing shell";
  }

  getShortDisplayName() {
    return "85mm AP";
  }

  getBackgroundImage() {
    return "/img/ammo/85mmAP.png";
  }
}

export default Ammo85mmAP;
