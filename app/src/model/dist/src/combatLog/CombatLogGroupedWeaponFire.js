import CombatLogWeaponFire from "./CombatLogWeaponFire";
class CombatLogGroupedWeaponFire {
    targetId;
    entries;
    replayOrder;
    constructor(targetId) {
        this.targetId = targetId;
        this.entries = [];
        this.replayOrder = 5;
    }
    addEntry(fire) {
        this.entries.push(fire);
    }
    serialize() {
        return {
            logEntryClass: this.constructor.name,
            targetId: this.targetId,
            entries: this.entries.map((entry) => entry.serialize()),
        };
    }
    deserialize(unknownData) {
        const data = unknownData;
        this.targetId = data.targetId;
        this.entries = data.entries
            ? data.entries.map((entry) => CombatLogWeaponFire.fromData(entry))
            : [];
        return this;
    }
}
export default CombatLogGroupedWeaponFire;
