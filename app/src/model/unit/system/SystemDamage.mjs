import DamageEntry from "./DamageEntry.mjs";
import CriticalEntry from "./CriticalEntry.mjs";

class SystemDamage {
  constructor(system) {
    this.system = system;
    this.entries = [];
    this.criticals = [];
  }

  serialize() {
    return {
      entries: this.entries.map(entry => entry.serialize()),
      criticals: this.criticals.map(entry => entry.serialize())
    };
  }

  deserialize(data) {
    this.entries = data.entries
      ? data.entries.map(entry => new DamageEntry().deserialize(entry))
      : [];

    this.criticals = data.criticals
      ? data.criticals.map(entry => new CriticalEntry().deserialize(entry))
      : [];

    return this;
  }

  addDamage(damage) {
    this.entries.push(damage);
  }

  getDamageById(id) {
    const entry = this.entries.find(damage => damage.id === id);

    if (entry) {
      entry.setSystem(this.system);
    }

    return entry;
  }

  rollCritical(damageEntry) {
    return [];
    //TODO: roll if this damage causes any critical hits
    // return gameEvent for log etc
  }

  addCritical(critical) {
    this.criticals.push(new CriticalEntry(critical));
  }

  hasCritical(name) {
    return this.criticals.some(crit => crit.is(name));
  }

  hasAnyCritical() {
    return this.criticals.length > 0;
  }

  getTotalDamage() {
    return this.entries.reduce((acc, entry) => acc + entry.getDamage(), 0);
  }

  isDestroyed() {
    return this.getTotalDamage() >= this.system.hitpoints;
  }

  advanceTurn() {
    this.entries = this.entries
      .map(entry => entry.advanceTurn())
      .filter(Boolean);
    this.criticals = this.criticals
      .map(entry => entry.advanceTurn())
      .filter(Boolean);
  }
}

export default SystemDamage;
