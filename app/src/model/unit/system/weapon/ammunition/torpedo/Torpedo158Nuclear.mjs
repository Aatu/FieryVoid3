import Torpedo158 from "./Torpedo158.mjs";
import HETorpedoDamageStrategy from "./torpedoDamageStrategy/HETorpedoDamageStrategy.mjs";

class Torpedo158Nuclear extends Torpedo158 {
  constructor(args) {
    super({});

    this.damageStrategy = new HETorpedoDamageStrategy("d10+4", 0, "d20+60");
  }

  getCargoInfo() {
    const previousResponse = super.getCargoInfo();

    return [
      {
        value: "A long range torpedo with 8 megaton nuclear payload."
      },
      ...previousResponse
    ];
  }

  getDisplayName() {
    return "Bodkin 1.53m nuclear torpedo";
  }

  getBackgroundImage() {
    return "/img/system/torpedoNuclear.png";
  }
}

export default Torpedo158Nuclear;
