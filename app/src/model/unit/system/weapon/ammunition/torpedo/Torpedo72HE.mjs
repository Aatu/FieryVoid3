import Torpedo72 from "./Torpedo72.mjs";
import HETorpedoDamageStrategy from "./torpedoDamageStrategy/HETorpedoDamageStrategy.mjs";

class Torpedo72HE extends Torpedo72 {
  constructor() {
    super({ deltaVelocityPerTurn: 42, turnsToLive: 4 });

    this.damageStrategy = new HETorpedoDamageStrategy("d8+4", 0, "d3+3");
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
        value: "A medium range torpedo with high explosive warhead."
      },
      ...previousResponse
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
