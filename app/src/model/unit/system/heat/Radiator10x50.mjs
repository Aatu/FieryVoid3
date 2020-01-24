import Radiator from "./Radiator.mjs";

class Radiator10x50 extends Radiator {
  constructor({ id }) {
    super({ id, hitpoints: 12, armor: 0 }, 24, 24, 6);
  }

  getDisplayName() {
    return "10x50m radiator panels";
  }

  getBackgroundImage() {
    return "/img/system/radiator.png";
  }
}

export default Radiator10x50;
