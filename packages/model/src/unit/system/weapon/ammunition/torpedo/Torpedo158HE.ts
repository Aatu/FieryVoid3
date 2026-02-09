import Torpedo158 from "./Torpedo158";
import TorpedoDamageStrategy from "./torpedoDamageStrategy/TorpedoDamageStrategy";

class Torpedo158HE extends Torpedo158 {
  constructor() {
    super({});

    this.damageStrategy = new TorpedoDamageStrategy({
      damageFormula: "d10+8",
      iterations: "d8+6",
    });
  }

  getCargoInfo() {
    const previousResponse = super.getCargoInfo();

    return [
      {
        value: "A long range torpedo with high explosive warhead.",
      },
      ...previousResponse,
    ];
  }

  getDisplayName() {
    return "Meteor 1.53m HE torpedo";
  }

  getBackgroundImage() {
    return "/img/system/torpedoHE.png";
  }
}

export default Torpedo158HE;
