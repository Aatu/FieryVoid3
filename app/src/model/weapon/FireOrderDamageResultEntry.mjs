class FireOrderDamageResultEntry {
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
}

export default FireOrderDamageResultEntry;
