import { combatLogClasses, CombatLogEntry } from "./combatLogClasses";
import CombatLogWeaponFire from "./CombatLogWeaponFire";
import CombatLogGroupedWeaponFire from "./CombatLogGroupedWeaponFire";
import CombatLogTorpedoAttack from "./CombatLogTorpedoAttack";
import CombatLogGroupedTorpedoAttack from "./CombatLogGroupedTorpedoAttack";
import CombatLogTorpedoIntercept from "./CombatLogTorpedoIntercept";

export type SerializedCombatLogData = { logEntryClass: string }[];

class CombatLogData {
  public entries: CombatLogEntry[];

  constructor() {
    this.entries = [];
  }

  addEntry(entry: CombatLogEntry) {
    this.entries.push(entry);
  }

  serialize(): SerializedCombatLogData {
    return this.entries.map((entry) => entry.serialize());
  }

  deserialize(data: SerializedCombatLogData = []) {
    this.entries = data
      ? data.map((entry) =>
          // @ts-expect-error dunno:3
          new combatLogClasses[entry.logEntryClass]().deserialize(entry)
        )
      : [];

    return this;
  }

  advanceTurn() {
    this.entries = [];
  }

  getInterceptsFor(torpedoAttack: CombatLogTorpedoAttack) {
    return this.entries
      .filter((entry) => entry instanceof CombatLogTorpedoIntercept)
      .filter(
        (entry) => entry.torpedoFlightId === torpedoAttack.torpedoFlightId
      );
  }

  getForReplay() {
    const entries = [...this.entries];
    const groupedFires: CombatLogGroupedWeaponFire[] = [];

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

    const groupedTorpedos: CombatLogGroupedTorpedoAttack[] = [];

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
