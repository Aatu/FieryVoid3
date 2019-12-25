import CombatLogDamageEntry from "../combatLog/CombatLogDamageEntry.mjs";

class FireOrderDamageResult {
  constructor(shotsHit, totalShots, shots = []) {
    this.shotsHit = shotsHit;
    this.totalShots = totalShots;
    this.shots = shots;
  }

  serialize() {
    return {
      name: "FireOrderDamageResult",
      shotsHit: this.shotsHit,
      totalShots: this.totalShots,
      shots: this.shots.map(shot => shot.serialize())
    };
  }

  deserialize(data = {}) {
    this.shotsHit = data.shotsHit || 0;
    this.totalShots = data.totalShots || 1;
    this.shots = data.shots
      ? data.shots.map(shot => new CombatLogDamageEntry().deserialize(shot))
      : [];

    return this;
  }
}

export default FireOrderDamageResult;
