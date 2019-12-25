import { combatLogClasses } from "./combatLogClasses";

class CombatLogData {
  constructor() {
    this.entries = [];
  }

  addEntry(entry) {
    this.entries.push(entry);
  }

  serialize() {
    return {
      entries: this.entries.map(entry => entry.serialize())
    };
  }

  deserialize(data = {}) {
    this.entries = data.entries
      ? data.entries.map(entry =>
          new combatLogClasses[entry.logEntryClass]().deserialize(entry)
        )
      : [];

    return this;
  }

  advanceTurn() {
    this.entries = [];
  }
}

export default CombatLogData;
