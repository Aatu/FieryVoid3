import CombatLogDamageEntry from "./CombatLogDamageEntry";
import CombatLogWeaponFireHitResult from "./CombatLogWeaponFireHitResult";
class CombatLogWeaponFire {
    fireOrderId;
    targetId;
    shooterId;
    damages;
    notes;
    hitResult;
    shotsHit = 0;
    totalShots = 0;
    ammoName;
    replayOrder = 0;
    static fromData(data) {
        return new CombatLogWeaponFire(data.fireOrderId, data.targetId, data.shooterId, null).deserialize(data);
    }
    constructor(fireOrderId, targetId, shooterId, ammo) {
        this.fireOrderId = fireOrderId;
        this.targetId = targetId;
        this.shooterId = shooterId;
        this.damages = [];
        this.notes = [];
        this.hitResult = null;
        this.ammoName = ammo ? ammo.getShortDisplayName() : null;
    }
    addNote(note) {
        this.notes.push(note);
    }
    addDamage(damageEntry) {
        this.damages.push(damageEntry);
    }
    addHitResult(hitResult) {
        this.hitResult = hitResult;
    }
    getHitResult() {
        if (!this.hitResult) {
            throw new Error("No hit result found");
        }
        return this.hitResult;
    }
    setShots(shotsHit, totalShots) {
        this.shotsHit = shotsHit;
        this.totalShots = totalShots;
    }
    causedDamage() {
        return this.damages.length > 0;
    }
    getDamages(target) {
        const reduceDamageEntries = (all, entry) => {
            const system = target.systems.getSystemById(entry.systemId);
            return [
                ...all,
                ...entry.damageIds
                    .map((id) => system.damage.getDamageById(id))
                    .filter(Boolean),
            ];
        };
        return this.damages.reduce((all, current) => {
            return [
                ...all,
                ...current.entries.reduce(reduceDamageEntries, []),
            ];
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
            fireOrderId: this.fireOrderId,
            targetId: this.targetId,
            shooterId: this.shooterId,
            damages: this.damages.map((damage) => damage.serialize()),
            notes: this.notes,
            hitResult: this.hitResult ? this.hitResult.serialize() : null,
            shotsHit: this.shotsHit,
            totalShots: this.totalShots,
            ammoName: this.ammoName,
        };
    }
    deserialize(unknownData) {
        const data = unknownData;
        this.fireOrderId = data.fireOrderId;
        this.targetId = data.targetId;
        this.shooterId = data.shooterId;
        this.damages = data.damages.map((damage) => new CombatLogDamageEntry().deserialize(damage));
        this.notes = data.notes || [];
        this.hitResult = data.hitResult
            ? CombatLogWeaponFireHitResult.fromData(data.hitResult)
            : null;
        this.shotsHit = data.shotsHit || 0;
        this.totalShots = data.totalShots || 0;
        this.ammoName = data.ammoName || null;
        return this;
    }
}
export default CombatLogWeaponFire;
