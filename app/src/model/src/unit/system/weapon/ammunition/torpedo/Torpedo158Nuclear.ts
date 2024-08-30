import Torpedo158 from "./Torpedo158";
import TorpedoDamageStrategy from "./torpedoDamageStrategy/TorpedoDamageStrategy";

class Torpedo158Nuclear extends Torpedo158 {
  constructor() {
    super({ evasion: 20 });

    this.damageStrategy = new TorpedoDamageStrategy({
      damageFormula: "d10+8",
      iterations: "d20+60",
    });
  }

  getCargoInfo() {
    const previousResponse = super.getCargoInfo();

    return [
      {
        value: "A long range torpedo with a nuclear payload.",
      },
      ...previousResponse,
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
