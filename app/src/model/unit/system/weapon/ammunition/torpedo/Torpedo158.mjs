import CargoEntity from "../../../cargo/CargoEntity.mjs";

class Torpedo158 extends CargoEntity {
  constructor({
    deltaVelocityPerTurn,
    turnsToLive,
    maxInterceptVelocity = 140,
    hitSize = -20,
    evasion = 2
  }) {
    super();
    this.deltaVelocityPerTurn = deltaVelocityPerTurn;
    this.turnsToLive = turnsToLive;
    this.maxInterceptVelocity = maxInterceptVelocity;
    this.hitSize = hitSize;
    this.evasion = evasion;
  }

  getHitSize() {
    return this.hitSize;
  }

  getEvasion() {
    return this.evasion;
  }

  getInterceptTries(velocity) {
    if (velocity > this.maxInterceptVelocity) {
      velocity = this.maxInterceptVelocity;
    }

    return Math.ceil(this.maxInterceptVelocity / velocity);
  }

  getCargoInfo() {
    const previousResponse = super.getCargoInfo();

    return [
      ...previousResponse,
      { header: "Velocity per turn", value: this.deltaVelocityPerTurn },
      { header: "Turns active", value: this.turnsToLive }
    ];
  }
}

export default Torpedo158;
