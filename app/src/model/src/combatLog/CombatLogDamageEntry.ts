import Ship from "../unit/Ship";
import DamageEntry from "../unit/system/DamageEntry";
import ShipSystem from "../unit/system/ShipSystem";
import { ICombatLogEntry } from "./combatLogClasses";

export type SerializedCombatLogDamageEntry = {
  logEntryClass: string;
  entries: { systemId: number; damageIds: string[] }[];
  notes: string[];
};

class CombatLogDamageEntry implements ICombatLogEntry {
  public entries: { systemId: number; damageIds: string[] }[];
  public notes: string[];
  public replayOrder: number = 0;

  constructor() {
    this.entries = [];
    this.notes = [];
  }

  addNote(note: string) {
    this.notes.push(note);
  }

  serialize(): SerializedCombatLogDamageEntry {
    return {
      logEntryClass: this.constructor.name,
      entries: this.entries,
      notes: this.notes,
    };
  }

  deserialize(data: SerializedCombatLogDamageEntry) {
    this.entries = data.entries || [];
    this.notes = data.notes || [];
    return this;
  }

  add(system: ShipSystem, damage: DamageEntry | DamageEntry[]) {
    this.entries.push({
      systemId: system.id,
      damageIds: ([] as DamageEntry[]).concat(damage).map((d) => d.id),
    });
  }

  getDamages(target: Ship) {
    return this.entries.reduce((total, { systemId, damageIds }) => {
      const system = target.systems.getSystemById(systemId);

      const damages: DamageEntry[] = damageIds
        .map((damageId) => system.damage.getDamageById(damageId))
        .filter(Boolean) as DamageEntry[];

      return total.concat(damages);
    }, [] as DamageEntry[]);
  }
}

export default CombatLogDamageEntry;
