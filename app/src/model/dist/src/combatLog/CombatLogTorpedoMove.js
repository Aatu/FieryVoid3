import Vector from "../utils/Vector";
class CombatLogTorpedoMove {
    torpedoFlightId;
    startPosition;
    endPosition;
    velocity;
    replayOrder;
    constructor(torpedoFlightId, startPosition, endPosition, velocity) {
        this.torpedoFlightId = torpedoFlightId;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.velocity = velocity;
        this.replayOrder = 30;
    }
    serialize() {
        return {
            logEntryClass: this.constructor.name,
            torpedoFlightId: this.torpedoFlightId,
            startPosition: this.startPosition,
            endPosition: this.endPosition,
            velocity: this.velocity,
        };
    }
    deserialize(unknownData) {
        const data = unknownData;
        this.torpedoFlightId = data.torpedoFlightId;
        this.startPosition = new Vector(data.startPosition);
        this.endPosition = new Vector(data.endPosition);
        this.velocity = new Vector(data.velocity);
        return this;
    }
}
export default CombatLogTorpedoMove;
