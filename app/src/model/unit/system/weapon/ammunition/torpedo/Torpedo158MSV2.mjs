import Torpedo158 from "./Torpedo158.mjs";
import MSVTorpedoDamageStrategy from "./torpedoDamageStrategy/MSVTorpedoDamageStrategy.mjs";

class Torpedo158MSV2 extends Torpedo158 {
  constructor() {
    super({ deltaVelocityPerTurn: 48, turnsToLive: 6, evasion: 35 });

    this.damageStrategy = new MSVTorpedoDamageStrategy("d3", 0, 5, 84, 10);

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
        value:
          "A long range torpedo with Multiple Strike Vehicles. Designed to supress smaller targets."
      },
      ...previousResponse
    ];
  }

  getDisplayName() {
    return "Shrike B 1.53m saturation MSV torpedo";
  }

  getBackgroundImage() {
    return "/img/system/torpedoMSV2.png";
  }
}

export default Torpedo158MSV2;
