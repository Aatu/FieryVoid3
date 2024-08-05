import { combatLogClasses } from "./combatLogClasses.mjs";
import CombatLogWeaponFire from "./CombatLogWeaponFire.mjs";
import CombatLogGroupedWeaponFire from "./CombatLogGroupedWeaponFire.mjs";
import CombatLogTorpedoAttack from "./CombatLogTorpedoAttack.mjs";
import CombatLogGroupedTorpedoAttack from "./CombatLogGroupedTorpedoAttack.mjs";
import CombatLogTorpedoIntercept from "./CombatLogTorpedoIntercept.mjs";

class CombatLogData {
  constructor() {
    this.entries = [];
  }

  addEntry(entry) {
    this.entries.push(entry);
  }

  serialize() {
    return {
      entries: this.entries.map((entry) => entry.serialize()),
    };
  }

  deserialize(data = {}) {
    this.entries = data.entries
      ? data.entries.map((entry) =>
          new combatLogClasses[entry.logEntryClass]().deserialize(entry)
        )
      : [];

    return this;
  }

  advanceTurn() {
    this.entries = [];
  }

  getInterceptsFor(torpedoAttack) {
    return this.entries
      .filter((entry) => entry instanceof CombatLogTorpedoIntercept)
      .filter(
        (entry) => entry.torpedoFlightId === torpedoAttack.torpedoFlightId
      );
  }

  getForReplay() {
    const entries = [...this.entries];
    const groupedFires = [];

    entries
      .filter((entry) => entry instanceof CombatLogWeaponFire)
      .forEach((fire) => {
        let entry = groupedFires.find(
          (grouped) => grouped.targetId === fire.targetId
        );

        if (!entry) {
          entry = new CombatLogGroupedWeaponFire(fire.targetId);
          groupedFires.push(entry);
        }

        entry.addEntry(fire);
      });

    const groupedTorpedos = [];

    entries
      .filter((entry) => entry instanceof CombatLogTorpedoAttack)
      .forEach((torpedo) => {
        let entry = groupedTorpedos.find(
          (grouped) => grouped.targetId === torpedo.targetId
        );

        if (!entry) {
          entry = new CombatLogGroupedTorpedoAttack(torpedo.targetId);
          groupedTorpedos.push(entry);
        }

        entry.addEntry(torpedo);
      });

    return [
      ...this.entries.filter(
        (entry) => !(entry instanceof CombatLogWeaponFire)
      ),
      ...groupedFires,
      ...groupedTorpedos,
    ]
      .filter((entry) => entry.replayOrder)
      .sort((a, b) => {
        if (a.replayOrder > b.replayOrder) {
          return 1;
        }

        if (a.replayOrder < b.replayOrder) {
          return -1;
        }

        return 0;
      });
  }
}

export default CombatLogData;
