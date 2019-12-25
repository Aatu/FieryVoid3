class CombatLogTorpedoIntercept {
  constructor(torpedoFlightId) {
    this.torpedoFlightId = torpedoFlightId;
  }

  serialize() {
    return {
      logEntryClass: this.constructor.name,
      torpedoFlightId: this.torpedoFlightId
    };
  }

  deserialize(data = {}) {
    this.torpedoFlightId = data.torpedoFlightId;
    return this;
  }
}

export default CombatLogTorpedoIntercept;
