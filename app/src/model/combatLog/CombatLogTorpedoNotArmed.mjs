class CombatLogTorpedoNotArmed {
  constructor(torpedoFlightId, turnsActive, armingTime) {
    this.torpedoFlightId = torpedoFlightId;
    this.turnsActive = turnsActive;
    this.armingTime = armingTime;
  }

  serialize() {
    return {
      logEntryClass: this.constructor.name,
      torpedoFlightId: this.torpedoFlightId,
      turnsActive: this.turnsActive,
      armingTime: this.armingTime
    };
  }

  deserialize(data = {}) {
    this.torpedoFlightId = data.torpedoFlightId;
    this.turnsActive = data.turnsActive;
    this.armingTime = data.armingTime;
    return this;
  }
}

export default CombatLogTorpedoNotArmed;
