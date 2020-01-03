class CombatLogDamageEntry {
  constructor() {
    this.entries = [];
  }

  serialize() {
    return {
      logEntryClass: this.constructor.name,
      entries: this.entries
    };
  }

  deserialize(data = {}) {
    this.entries = data.entries || [];
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
