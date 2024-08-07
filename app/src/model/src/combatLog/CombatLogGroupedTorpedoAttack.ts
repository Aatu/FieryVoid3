import { ICombatLogEntry } from "./combatLogClasses";
import CombatLogTorpedoAttack, {
  SerializedCombatLogTorpedoAttack,
} from "./CombatLogTorpedoAttack";

export type SerializedCombatLogGroupedTorpedoAttack = {
  logEntryClass: string;
  targetId: string;
  entries: SerializedCombatLogTorpedoAttack[];
};

class CombatLogGroupedTorpedoAttack implements ICombatLogEntry {
  public targetId: string;
  public entries: CombatLogTorpedoAttack[];
  public replayOrder: number;

  constructor(targetId: string) {
    this.targetId = targetId;
    this.entries = [];
    this.replayOrder = 10;
  }

  addEntry(attack: CombatLogTorpedoAttack) {
    this.entries.push(attack);
  }

  serialize(): SerializedCombatLogGroupedTorpedoAttack {
    return {
      targetId: this.targetId,
      logEntryClass: this.constructor.name,
      entries: this.entries.map((entry) => entry.serialize()),
    };
  }

  deserialize(data: SerializedCombatLogGroupedTorpedoAttack) {
    this.targetId = data.targetId;
    this.entries = data.entries
      ? data.entries.map((entry) => CombatLogTorpedoAttack.fromData(entry))
      : [];
    return this;
  }
}

export default CombatLogGroupedTorpedoAttack;
