import Radiator from "./Radiator.mjs";

class Radiator10x40 extends Radiator {
  constructor({ id }) {
    super({ id, hitpoints: 10, armor: 0 }, 20, 20, 6);
  }

  getDisplayName() {
    return "10x40m radiator sail";
  }

  getBackgroundImage() {
    return "/img/system/radiator.png";
  }
}

export default Radiator10x40;
