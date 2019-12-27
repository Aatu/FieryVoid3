import CombatLogDamageEntry from "./CombatLogDamageEntry.mjs";
import CombatLogWeaponFireHitResult from "./CombatLogWeaponFireHitResult.mjs";

class CombatLogWeaponFire {
  constructor(fireOrderId) {
    this.fireOrderId = fireOrderId;
    this.damages = [];
    this.notes = [];
    this.hitResult = null;
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

  serialize() {
    return {
      logEntryClass: this.constructor.name,
      fireOrderId: this.fireOrderId,
      damages: this.damages.map(damage => damage.serialize()),
      notes: this.notes,
      hitResult: this.hitResult ? this.hitResult.serialize() : null,
      shotsHit: this.shotsHit,
      totalShots: this.totalShots
    };
  }

  deserialize(data = {}) {
    this.fireOrderId = data.fireOrderId;
    this.damages = data.damages.map(damage =>
      new CombatLogDamageEntry().deserialize(damage)
    );

    this.notes = data.notes || [];

    this.hitResult = data.hitResult
      ? new CombatLogWeaponFireHitResult().deserialize(data.hitResult)
      : null;

    this.shotsHit = data.shotsHit || 0;
    this.totalShots = data.totalShots || 0;

    return this;
  }
}

export default CombatLogWeaponFire;
