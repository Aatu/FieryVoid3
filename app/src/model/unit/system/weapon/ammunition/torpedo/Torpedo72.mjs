import Torpedo from "./Torpedo.mjs";

class Torpedo72 extends Torpedo {
  constructor({
    deltaVelocityPerTurn,
    turnsToLive = 4,
    maxInterceptVelocity = 110,
    hitSize = 0,
    evasion = 50
  }) {
    super({
      deltaVelocityPerTurn,
      turnsToLive,
      maxInterceptVelocity,
      hitSize,
      evasion
    });
  }
}

export default Torpedo72;
