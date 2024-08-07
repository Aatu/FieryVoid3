import { ICombatLogEntry } from "./combatLogClasses";
import CombatLogWeaponFire, {
  SerializedCombatLogWeaponFire,
} from "./CombatLogWeaponFire";

export type SerializedCombatLogGroupedWeaponFire = {
  logEntryClass: string;
  targetId: string;
  entries: SerializedCombatLogWeaponFire[];
};

class CombatLogGroupedWeaponFire implements ICombatLogEntry {
  public targetId: string;
  public entries: CombatLogWeaponFire[];
  public replayOrder: number;

  constructor(targetId: string) {
    this.targetId = targetId;
    this.entries = [];
    this.replayOrder = 5;
  }

  addEntry(fire: CombatLogWeaponFire) {
    this.entries.push(fire);
  }

  serialize(): SerializedCombatLogGroupedWeaponFire {
    return {
      logEntryClass: this.constructor.name,
      targetId: this.targetId,
      entries: this.entries.map((entry) => entry.serialize()),
    };
  }

  deserialize(data: SerializedCombatLogGroupedWeaponFire) {
    this.targetId = data.targetId;
    this.entries = data.entries
      ? data.entries.map((entry) => CombatLogWeaponFire.fromData(entry))
      : [];
    return this;
  }
}

export default CombatLogGroupedWeaponFire;
