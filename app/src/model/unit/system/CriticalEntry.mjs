import * as criticals from "./criticals/index.mjs";

class CriticalEntry {
  constructor(critical) {
    this.critical = critical;
    this.turnsRemaining = critical ? critical.getDuration() : null;
  }

  serialize() {
    return {
      criticalClass: this.critical.getClassName(),
      turnsRemaining: this.turnsRemaining
    };
  }

  deserialize(data) {
    this.critical = new criticals[data.criticalClass]();
    this.turnsRemaining = data.turnsRemaining || null;

    return this;
  }

  getDamage() {
    return this.amount;
  }

  advanceTurn() {
    if (this.turnsRemaining <= 1) {
      return null;
    }

    return new CriticalEntry(this.critical).setTurnsRemaining(
      this.turnsRemaining - 1
    );
  }

  setTurnsRemaining(turns) {
    this.turnsRemaining = turns;
    return this;
  }

  is(name) {
    return this.critical instanceof name;
  }
}

export default CriticalEntry;
