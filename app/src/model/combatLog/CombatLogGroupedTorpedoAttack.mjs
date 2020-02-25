import CombatLogTorpedoAttack from "./CombatLogTorpedoAttack.mjs";

class CombatLogGroupedTorpedoAttack {
  constructor(targetId) {
    this.targetId = targetId;
    this.entries = [];
    this.replayOrder = 20;
  }

  addEntry(attack) {
    this.entries.push(attack);
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
      ? data.entries.map(entry =>
          new CombatLogTorpedoAttack().deserialize(entry)
        )
      : [];
    return this;
  }
}

export default CombatLogGroupedTorpedoAttack;
