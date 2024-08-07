import Ship from "../unit/Ship";
import DamageEntry from "../unit/system/DamageEntry";
import { ICombatLogEntry } from "./combatLogClasses";
import CombatLogDamageEntry, {
  SerializedCombatLogDamageEntry,
} from "./CombatLogDamageEntry";

export type SerializedCombatLogTorpedoAttack = {
  logEntryClass: string;
  torpedoFlightId: string;
  targetId: string;
  damages: SerializedCombatLogDamageEntry[];
  notes: string[];
};

class CombatLogTorpedoAttack implements ICombatLogEntry {
  public torpedoFlightId: string;
  public targetId: string;
  public damages: CombatLogDamageEntry[];
  public notes: string[];
  public replayOrder: number = 0;

  public static fromData(data: SerializedCombatLogTorpedoAttack) {
    return new CombatLogTorpedoAttack("", "").deserialize(data);
  }

  constructor(torpedoFlightId: string, targetId: string) {
    this.torpedoFlightId = torpedoFlightId;
    this.targetId = targetId;
    this.damages = [];
    this.notes = [];
  }

  addNote(note: string) {
    this.notes.push(note);
  }

  addDamage(damageEntry: CombatLogDamageEntry) {
    this.damages.push(damageEntry);
  }

  getDamages(target: Ship) {
    const reduceDamages = (
      all: DamageEntry[],
      entry: { systemId: number; damageIds: string[] }
    ): DamageEntry[] => {
      const system = target.systems.getSystemById(entry.systemId);

      return [
        ...all,
        ...(entry.damageIds
          .map((id) => system.damage.getDamageById(id))
          .filter(Boolean) as DamageEntry[]),
      ];
    };

    return this.damages.reduce((all, current) => {
      return [...all, ...current.entries.reduce(reduceDamages, [])];
    }, [] as DamageEntry[]);
  }

  getDestroyedSystems(target: Ship) {
    return this.getDamages(target)
      .filter((damage) => damage.destroyedSystem)
      .map((damage) => damage.system);
  }

  serialize(): SerializedCombatLogTorpedoAttack {
    return {
      logEntryClass: this.constructor.name,
      torpedoFlightId: this.torpedoFlightId,
      damages: this.damages.map((damage) => damage.serialize()),
      notes: this.notes,
      targetId: this.targetId,
    };
  }

  deserialize(data: SerializedCombatLogTorpedoAttack) {
    this.torpedoFlightId = data.torpedoFlightId;
    this.targetId = data.targetId;
    this.damages = data.damages.map((damage) =>
      new CombatLogDamageEntry().deserialize(damage)
    );

    this.notes = data.notes || [];
    return this;
  }
}

export default CombatLogTorpedoAttack;
