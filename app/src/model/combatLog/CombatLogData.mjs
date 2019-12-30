import { combatLogClasses } from "./combatLogClasses.mjs";
import CombatLogWeaponFire from "./CombatLogWeaponFire.mjs";

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

  getForReplay() {
    console.log("log entries", this.entries);
    return [...this.entries]
      .filter(entry => entry.replayOrder)
      .sort((a, b) => {
        if (a.replayOrder > b.replayOrder) {
          return 1;
        }

        if (a.replayOrder < b.replayOrder) {
          return -1;
        }

        if (
          a instanceof CombatLogWeaponFire &&
          b instanceof CombatLogWeaponFire
        ) {
          if (a.targetId > b.targetId) {
            return 1;
          }

          if (a.targetId < b.targetId) {
            return -1;
          }
        }

        return 0;
      });
  }
}

export default CombatLogData;
