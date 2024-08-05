class CombatLogDamageEntry {
  constructor() {
    this.entries = [];
    this.notes = [];
  }

  addNote(note) {
    this.notes.push(note);
  }

  serialize() {
    return {
      logEntryClass: this.constructor.name,
      entries: this.entries,
      notes: this.notes
    };
  }

  deserialize(data = {}) {
    this.entries = data.entries || [];
    this.notes = data.notes || [];
    return this;
  }

  add(system, damage) {
    this.entries.push({
      systemId: system.id,
      damageIds: [].concat(damage).map(d => d.id)
    });
  }

  getDamages(target) {
    return this.entries.reduce((total, { systemId, damageIds }) => {
      const system = target.systems.getSystemById(systemId);

      return total.concat(
        damageIds.map(damageId => system.damage.getDamageById(damageId))
      );
    }, []);
  }
}

export default CombatLogDamageEntry;
