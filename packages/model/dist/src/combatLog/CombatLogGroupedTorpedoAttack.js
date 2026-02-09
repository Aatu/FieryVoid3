import CombatLogTorpedoAttack from "./CombatLogTorpedoAttack";
class CombatLogGroupedTorpedoAttack {
    targetId;
    entries;
    replayOrder;
    constructor(targetId) {
        this.targetId = targetId;
        this.entries = [];
        this.replayOrder = 10;
    }
    addEntry(attack) {
        this.entries.push(attack);
    }
    serialize() {
        return {
            targetId: this.targetId,
            logEntryClass: this.constructor.name,
            entries: this.entries.map((entry) => entry.serialize()),
        };
    }
    deserialize(unknownData) {
        const data = unknownData;
        this.targetId = data.targetId;
        this.entries = data.entries
            ? data.entries.map((entry) => CombatLogTorpedoAttack.fromData(entry))
            : [];
        return this;
    }
}
export default CombatLogGroupedTorpedoAttack;
