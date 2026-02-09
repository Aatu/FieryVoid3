class CombatLogShipVelocity {
    shipId;
    replayOrder;
    constructor(shipId) {
        this.shipId = shipId;
        this.replayOrder = 10;
    }
    serialize() {
        return {
            logEntryClass: this.constructor.name,
            shipId: this.shipId,
        };
    }
    deserialize(unknownData) {
        const data = unknownData;
        this.shipId = data.shipId;
        return this;
    }
}
export default CombatLogShipVelocity;
