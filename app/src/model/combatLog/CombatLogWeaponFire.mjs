import CombatLogDamageEntry from "./CombatLogDamageEntry.mjs";
import CombatLogWeaponFireHitResult from "./CombatLogWeaponFireHitResult.mjs";

class CombatLogWeaponFire {
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

  setShots(shotsHit, totalShots) {
    this.shotsHit = shotsHit;
    this.totalShots = totalShots;
  }

  causedDamage() {
    return this.damages.length > 0;
  }

  getDamages(target) {
    return this.damages.reduce((all, current) => {
      return [
        ...all,
        ...current.entries.reduce((all, damageEntry) => {
          const system = target.systems.getSystemById(damageEntry.systemId);

          return [
            ...all,
            ...damageEntry.damageIds.map(id => system.damage.getDamageById(id))
          ];
        }, [])
      ];
    }, []);
  }

  getDestroyedSystems(target) {
    return this.getDamages(target)
      .filter(damage => damage.destroyedSystem)
      .map(damage => damage.system);
  }

  serialize() {
    return {
      logEntryClass: this.constructor.name,
      fireOrderId: this.fireOrderId,
      targetId: this.targetId,
      shooterId: this.shooterId,
      damages: this.damages.map(damage => damage.serialize()),
      notes: this.notes,
      hitResult: this.hitResult ? this.hitResult.serialize() : null,
      shotsHit: this.shotsHit,
      totalShots: this.totalShots,
      ammoName: this.ammoName
    };
  }

  deserialize(data = {}) {
    this.fireOrderId = data.fireOrderId;
    this.targetId = data.targetId;
    this.shooterId = data.shooterId;
    this.damages = data.damages.map(damage =>
      new CombatLogDamageEntry().deserialize(damage)
    );

    this.notes = data.notes || [];

    this.hitResult = data.hitResult
      ? new CombatLogWeaponFireHitResult().deserialize(data.hitResult)
      : null;

    this.shotsHit = data.shotsHit || 0;
    this.totalShots = data.totalShots || 0;

    this.ammoName = data.ammoName || null;

    return this;
  }
}

export default CombatLogWeaponFire;
