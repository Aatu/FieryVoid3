class CombatLogTorpedoLaunch {
  constructor(torpedoFlightId) {
    this.torpedoFlightId = torpedoFlightId;
    this.replayOrder = 15;
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

export default CombatLogTorpedoLaunch;
