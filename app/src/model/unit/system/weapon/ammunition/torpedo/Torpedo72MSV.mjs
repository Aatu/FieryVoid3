import MSVTorpedoDamageStrategy from "./torpedoDamageStrategy/MSVTorpedoDamageStrategy.mjs";
import Torpedo72 from "./Torpedo72.mjs";

class Torpedo72MSV extends Torpedo72 {
  constructor() {
    super({ deltaVelocityPerTurn: 42, turnsToLive: 4 });

    this.damageStrategy = new MSVTorpedoDamageStrategy("2d2", "d3", 15, 25);
    this.visuals = {
      engineColor: [255 / 255, 222 / 255, 120 / 255],
      explosionType: "MSV"
    };
  }

  getInterceptTries(effectiveness, flight, target) {
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
        value: "A medium range torpedo with Multiple Strike Vehicles."
      },
      ...previousResponse
    ];
  }

  getDisplayName() {
    return "Avalanche 0.72m MSV torpedo";
  }

  getBackgroundImage() {
    return "/img/system/torpedoMSVsmall.png";
  }
}

export default Torpedo72MSV;
