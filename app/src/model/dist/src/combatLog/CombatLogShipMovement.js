class CombatLogShipMovement {
    shipId;
    replayOrder;
    constructor(shipId) {
        this.shipId = shipId;
        this.replayOrder = 20;
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
export default CombatLogShipMovement;
