import Torpedo from "./Torpedo.mjs";

class Torpedo158 extends Torpedo {
  constructor({
    deltaVelocityPerTurn,
    turnsToLive,
    maxInterceptVelocity = 140,
    hitSize = 0,
    evasion = 30
  }) {
    super({
      deltaVelocityPerTurn,
      turnsToLive,
      maxInterceptVelocity,
      hitSize,
      evasion,
      armingTime: 2
    });
  }
}

export default Torpedo158;