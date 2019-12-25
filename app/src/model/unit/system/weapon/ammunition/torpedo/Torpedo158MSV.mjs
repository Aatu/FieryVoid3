import Torpedo158 from "./Torpedo158.mjs";
import MSVTorpedoDamageStrategy from "./torpedoDamageStrategy.mjs/MSVTorpedoDamageStrategy.mjs";

class Torpedo158MSV extends Torpedo158 {
  constructor() {
    super({ deltaVelocityPerTurn: 48, turnsToLive: 6 });

    this.damageStrategy = new MSVTorpedoDamageStrategy("d6", "d3", 10, 32);
  }

  getCargoInfo() {
    const previousResponse = super.getCargoInfo();

    return [
      {
        value: "A long range torpedo with Multiple Strike Vehicles."
      },
      ...previousResponse
    ];
  }

  getMinRange() {
    return 3;
  }

  getDisplayName() {
    return "Shrike 1.53m MSV torpedo";
  }

  getBackgroundImage() {
    return "/img/system/torpedoMSV.png";
  }
}

export default Torpedo158MSV;
