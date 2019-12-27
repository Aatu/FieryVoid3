class CombatLogShipVelocity {
  constructor(shipId) {
    this.shipId = shipId;
  }

  serialize() {
    return {
      logEntryClass: this.constructor.name,
      shipId: this.shipId
    };
  }

  deserialize(data = {}) {
    this.shipId = data.shipId;
    return this;
  }
}

export default CombatLogShipVelocity;
