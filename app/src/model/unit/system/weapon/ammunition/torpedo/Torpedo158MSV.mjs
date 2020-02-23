import Torpedo158 from "./Torpedo158.mjs";
import MSVTorpedoDamageStrategy from "./torpedoDamageStrategy/MSVTorpedoDamageStrategy.mjs";

class Torpedo158MSV extends Torpedo158 {
  constructor() {
    super({});

    this.damageStrategy = new MSVTorpedoDamageStrategy("d3+3", 0, 15, 32);

    this.visuals = {
      engineColor: [255 / 255, 222 / 255, 120 / 255],
      explosionType: "MSV"
    };
  }

  getInterceptTries(flight, target) {
    const distance = this.getStrikeDistance(flight, target);
    if (distance > 5) {
      return [5];
    }

    return [distance];
  }

  getStrikeDistance(flight, target) {
    return this.damageStrategy.getStrikeDistance({
      target,
      torpedoFlight: flight
    });
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

  getDisplayName() {
    return "Shrike 1.53m MSV torpedo";
  }

  getBackgroundImage() {
    return "/img/system/torpedoMSV.png";
  }
}

export default Torpedo158MSV;
