import MSVTorpedoDamageStrategy from "./torpedoDamageStrategy.mjs/MSVTorpedoDamageStrategy.mjs";
import Torpedo72 from "./Torpedo72.mjs";

class Torpedo72MSV extends Torpedo72 {
  constructor() {
    super({ deltaVelocityPerTurn: 42, turnsToLive: 4 });

    this.damageStrategy = new MSVTorpedoDamageStrategy("2d2", "d3", 7, 25);
  }

  getCargoInfo() {
    const previousResponse = super.getCargoInfo();

    return [
      {
        value: "A medium range torpedo with Multiple Strike Vehicles."
      },
      ...previousResponse
    ];
  }

  getMinRange() {
    return 3;
  }

  getDisplayName() {
    return "Avalanche 0.72m MSV torpedo";
  }

  getBackgroundImage() {
    return "/img/system/torpedoMSVsmall.png";
  }
}

export default Torpedo72MSV;
