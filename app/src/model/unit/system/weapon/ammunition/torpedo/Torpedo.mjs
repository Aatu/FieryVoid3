import CargoEntity from "../../../cargo/CargoEntity.mjs";

class Torpedo extends CargoEntity {
  constructor({
    deltaVelocityPerTurn,
    turnsToLive,
    maxInterceptVelocity = 140,
    hitSize = 0,
    evasion = 30,
    armingTime = 1
  }) {
    super();
    this.deltaVelocityPerTurn = deltaVelocityPerTurn;
    this.turnsToLive = turnsToLive;
    this.maxInterceptVelocity = maxInterceptVelocity;
    this.hitSize = hitSize;
    this.evasion = evasion;
    this.armingTime = armingTime;

    this.damageStrategy = null;
  }

  getStrikeDistance(flight, target) {
    return 1;
  }

  getHitSize() {
    return this.hitSize;
  }

  getEvasion() {
    return this.evasion;
  }

  getInterceptTries(effectiveness, flight, target) {
    let tries = Math.round(5 * (1 - effectiveness));
    if (tries < 1) {
      tries = 1;
    }

    switch (tries) {
      case 1:
        return [1];
      case 2:
        return [1, 2];
      case 3:
        return [1, 2, 3];
      case 4:
        return [1, 2, 3, 4];
      case 5:
        return [1, 2, 3, 4, 5];
    }

    return tries;
  }

  getCargoInfo() {
    const previousResponse = super.getCargoInfo();

    return [
      ...previousResponse,
      { header: "Velocity per turn", value: this.deltaVelocityPerTurn },
      { header: "Turns active", value: this.turnsToLive },
      { header: "Arming time", value: this.armingTime },
      { header: "Evasion", value: this.evasion }
    ];
  }
}

export default Torpedo;
