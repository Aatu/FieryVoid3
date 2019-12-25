import Vector from "../utils/Vector.mjs";

class CombatLogTorpedoMove {
  constructor(torpedoFlightId, startPosition, endPosition) {
    this.torpedoFlightId = torpedoFlightId;
    this.startPosition = startPosition;
    this.endPosition = endPosition;
  }

  serialize() {
    return {
      logEntryClass: this.constructor.name,
      torpedoFlightId: this.torpedoFlightId,
      startPosition: this.startPosition,
      endPosition: this.endPosition
    };
  }

  deserialize(data = {}) {
    this.torpedoFlightId = data.torpedoFlightId;
    this.startPosition = new Vector(data.startPosition);
    this.endPosition = new Vector(data.endPosition);
    return this;
  }
}

export default CombatLogTorpedoMove;
