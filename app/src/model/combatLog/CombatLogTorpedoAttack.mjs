import CombatLogDamageEntry from "./CombatLogDamageEntry.mjs";

class CombatLogTorpedoAttack {
  constructor(torpedoFlightId) {
    this.torpedoFlightId = torpedoFlightId;
    this.damages = [];
    this.notes = [];
  }

  addNote(note) {
    this.notes.push(note);
  }
  addDamage(damageEntry) {
    this.damages.push(damageEntry);
  }

  serialize() {
    return {
      logEntryClass: this.constructor.name,
      torpedoFlightId: this.torpedoFlightId,
      damages: this.damages.map(damage => damage.serialize()),
      notes: this.notes
    };
  }

  deserialize(data = {}) {
    this.torpedoFlightId = data.torpedoFlightId;
    this.damages = data.damages.map(damage =>
      new CombatLogDamageEntry().deserialize(damage)
    );

    this.notes = data.notes || [];
    return this;
  }
}

export default CombatLogTorpedoAttack;
