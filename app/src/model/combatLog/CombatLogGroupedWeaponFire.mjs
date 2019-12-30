import CombatLogWeaponFire from "./CombatLogWeaponFire.mjs";

class CombatLogGroupedWeaponFire {
  constructor(targetId) {
    this.targetId = targetId;
    this.entries = [];
  }

  addEntry(fire) {
    this.entries.push(fire);
  }

  serialize() {
    return {
      logEntryClass: this.constructor.name,
      entries: this.entries.map(entry => entry.serialize())
    };
  }

  deserialize(data = {}) {
    this.targetId = data.targetId;
    this.entries = data.entries
      ? data.entries.map(entry => new CombatLogWeaponFire().deserialize(entry))
      : [];
    return this;
  }
}

export default CombatLogGroupedWeaponFire;
