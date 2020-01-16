import DamageEntry from "./DamageEntry.mjs";
import * as criticals from "./criticals/index.mjs";
import Critical from "./criticals/Critical.mjs";

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

  deserialize(data = {}) {
    this.entries = data.entries
      ? data.entries.map(entry => new DamageEntry().deserialize(entry))
      : [];

    this.criticals = data.criticals
      ? data.criticals.map(entry =>
          new criticals[entry.className]().deserialize(entry)
        )
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

  addCritical(critical) {
    this.criticals.push(critical);
  }

  filterReplaced(critical) {
    this.criticals = this.criticals.filter(old => !old.isReplacedBy(critical));
  }

  hasCritical(object) {
    switch (typeof object) {
      case "object":
        return this.criticals.some(
          crit => crit.constructor === object.constructor
        );
      case "function":
        return this.criticals.some(crit => crit instanceof object);

      case "string":
        return this.criticals.some(crit => crit.constructor.name === object);
    }
  }

  getCriticals() {
    return this.criticals;
  }

  hasAnyCritical() {
    return this.criticals.length > 0;
  }

  getTotalDamage() {
    const damage = this.entries.reduce(
      (acc, entry) => acc + entry.getDamage(),
      0
    );

    if (damage > this.system.hitpoints) {
      return this.system.hitpoints;
    }

    return damage;
  }

  getPercentUnDamaged() {
    return 1 - this.getTotalDamage() / this.system.hitpoints;
  }

  getNewDamage() {
    return this.entries
      .filter(entry => entry.new)
      .reduce((acc, entry) => acc + entry.getDamage(), 0);
  }

  isDestroyed() {
    return this.getTotalDamage() >= this.system.hitpoints;
  }

  advanceTurn() {
    this.entries = this.entries
      .map(entry => entry.advanceTurn())
      .filter(Boolean);
    this.criticals.forEach(critical => critical.advanceTurn());
    this.criticals = this.criticals.filter(
      critical => !critical.isFixed(this.system)
    );
  }
}

export default SystemDamage;
