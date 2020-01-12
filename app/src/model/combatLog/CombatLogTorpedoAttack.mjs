import CombatLogDamageEntry from "./CombatLogDamageEntry.mjs";

class CombatLogTorpedoAttack {
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
      torpedoFlightId: this.torpedoFlightId,
      damages: this.damages.map(damage => damage.serialize()),
      notes: this.notes,
      targetId: this.targetId
    };
  }

  deserialize(data = {}) {
    this.torpedoFlightId = data.torpedoFlightId;
    this.targetId = data.targetId;
    this.damages = data.damages.map(damage =>
      new CombatLogDamageEntry().deserialize(damage)
    );

    this.notes = data.notes || [];
    return this;
  }
}

export default CombatLogTorpedoAttack;
