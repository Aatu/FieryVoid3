import CombatLogDamageEntry from "./CombatLogDamageEntry";
class CombatLogTorpedoAttack {
    torpedoFlightId;
    targetId;
    damages;
    notes;
    replayOrder = 0;
    static fromData(data) {
        return new CombatLogTorpedoAttack("", "").deserialize(data);
    }
    constructor(torpedoFlightId, targetId) {
        this.torpedoFlightId = torpedoFlightId;
        this.targetId = targetId;
        this.damages = [];
        this.notes = [];
    }
    addNote(note) {
        this.notes.push(note);
    }
    addDamage(damageEntry) {
        this.damages.push(damageEntry);
    }
    getDamages(target) {
        const reduceDamages = (all, entry) => {
            const system = target.systems.getSystemById(entry.systemId);
            return [
                ...all,
                ...entry.damageIds
                    .map((id) => system.damage.getDamageById(id))
                    .filter(Boolean),
            ];
        };
        return this.damages.reduce((all, current) => {
            return [...all, ...current.entries.reduce(reduceDamages, [])];
        }, []);
    }
    getDestroyedSystems(target) {
        return this.getDamages(target)
            .filter((damage) => damage.destroyedSystem)
            .map((damage) => damage.system);
    }
    serialize() {
        return {
            logEntryClass: this.constructor.name,
            torpedoFlightId: this.torpedoFlightId,
            damages: this.damages.map((damage) => damage.serialize()),
            notes: this.notes,
            targetId: this.targetId,
        };
    }
    deserialize(unknownData) {
        const data = unknownData;
        this.torpedoFlightId = data.torpedoFlightId;
        this.targetId = data.targetId;
        this.damages = data.damages.map((damage) => new CombatLogDamageEntry().deserialize(damage));
        this.notes = data.notes || [];
        return this;
    }
}
export default CombatLogTorpedoAttack;
