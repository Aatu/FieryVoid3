import Torpedo72 from "./Torpedo72.mjs";
import HETorpedoDamageStrategy from "./torpedoDamageStrategy/HETorpedoDamageStrategy.js";

class Torpedo72HE extends Torpedo72 {
  constructor() {
    super({});

    this.damageStrategy = new HETorpedoDamageStrategy("d8+4", 0, "d3+3");
  }

  getCargoInfo() {
    const previousResponse = super.getCargoInfo();

    return [
      {
        value: "A medium range torpedo with high explosive warhead.",
      },
      ...previousResponse,
    ];
  }

  getDisplayName() {
    return "Pike 0.72m HE torpedo";
  }

  getBackgroundImage() {
    return "/img/system/torpedoHEsmall.png";
  }
}

export default Torpedo72HE;
