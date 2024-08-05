import Radiator from "./Radiator.mjs";

class Radiator5x40 extends Radiator {
  constructor({ id }) {
    super({ id, hitpoints: 5, armor: 0 }, 10, 10, 5);
  }

  getDisplayName() {
    return "5x40m radiator sail";
  }

  getBackgroundImage() {
    return "/img/system/radiator.png";
  }
}

export default Radiator5x40;
