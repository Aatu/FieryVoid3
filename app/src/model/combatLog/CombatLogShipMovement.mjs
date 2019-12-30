class CombatLogShipMovement {
  constructor(shipId) {
    this.shipId = shipId;
    this.replayOrder = 1;
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

export default CombatLogShipMovement;
