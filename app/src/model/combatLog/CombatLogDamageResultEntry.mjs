class CombatLogDamageResultEntry {
  constructor() {
    this.entries = [];
  }

  serialize() {
    return {
      entries: this.entries
    };
  }

  deserialize(data = {}) {
    this.entries = data.entries || [];
    return this;
  }

  add(system, damage, criticals) {
    this.entries.push({
      systemId: system.id,
      damageIds: [].concat(damage).map(d => d.id),
      criticalNames: [].concat(criticals).map(c => c.name)
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

export default CombatLogDamageResultEntry;
