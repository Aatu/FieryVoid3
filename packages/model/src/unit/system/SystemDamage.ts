import DamageEntry, { SerializedDamageEntry } from "./DamageEntry";
import * as criticals from "./criticals/index";
import Critical, { SerializedCritical } from "./criticals/Critical";
import ShipSystem from "./ShipSystem";

export type SerializedSystemDamage = {
  entries?: SerializedDamageEntry[];
  criticals?: SerializedCritical[];
};

class SystemDamage {
  private system: ShipSystem;
  private entries: DamageEntry[];
  private criticals: Critical[];

  constructor(system: ShipSystem) {
    this.system = system;
    this.entries = [];
    this.criticals = [];
  }

  serialize() {
    return {
      entries: this.entries.map((entry) => entry.serialize()),
      criticals: this.criticals.map((entry) => entry.serialize()),
    };
  }

  deserialize(data: SerializedSystemDamage = {}) {
    this.entries = data.entries
      ? data.entries.map((entry) => new DamageEntry().deserialize(entry))
      : [];

    this.criticals = data.criticals
      ? data.criticals.map((entry) =>
          // @ts-expect-error dunno how to fix this
          new criticals[entry.className]().deserialize(entry)
        )
      : [];

    return this;
  }

  addDamage(damage: DamageEntry) {
    this.entries.push(damage);
  }

  getDamageById(id: string) {
    const entry = this.entries.find((damage) => damage.id === id);

    if (entry) {
      entry.setSystem(this.system);
    }

    return entry;
  }

  addCritical(critical: Critical) {
    this.criticals.push(critical);
  }

  filterReplaced(critical: Critical) {
    this.criticals = this.criticals.filter(
      (old) => !old.isReplacedBy(critical)
    );
  }

  hasCritical(object: string | Function | object) {
    switch (typeof object) {
      case "object":
        return this.criticals.some(
          (crit) => crit.constructor === object.constructor
        );
      case "function":
        return this.criticals.some((crit) => crit instanceof object);

      case "string":
        return this.criticals.some((crit) => crit.constructor.name === object);
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
      .filter((entry) => entry.new)
      .reduce((acc, entry) => acc + entry.getDamage(), 0);
  }

  isDestroyed() {
    return this.getTotalDamage() >= this.system.hitpoints;
  }

  advanceTurn(turn: number) {
    this.entries = this.entries
      .map((entry) => entry.advanceTurn())
      .filter(Boolean);
    this.criticals.forEach((critical) => critical.advanceTurn());
    this.criticals = this.criticals.filter(
      (critical) => !critical.isFixed(this.system)
    );
  }
}

export default SystemDamage;
