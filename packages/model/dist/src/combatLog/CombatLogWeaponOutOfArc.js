class CombatLogWeaponOutOfArc {
    fireOrderId;
    replayOrder = 0;
    constructor(fireOrderId) {
        this.fireOrderId = fireOrderId;
    }
    serialize() {
        return {
            logEntryClass: this.constructor.name,
            fireOrderId: this.fireOrderId,
        };
    }
    deserialize(unknownData) {
        const data = unknownData;
        this.fireOrderId = data.fireOrderId;
        return this;
    }
}
export default CombatLogWeaponOutOfArc;
