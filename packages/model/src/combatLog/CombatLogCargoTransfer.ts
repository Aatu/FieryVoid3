import { ICombatLogEntry } from "./combatLogClasses";

type SerialiedCombatLogCargoTransfer = {
  logEntryClass: string;
  notes: string[];
};

export class CombatLogCargoTransfer implements ICombatLogEntry {
  private notes: string[] = [];

  addNote(note: string) {
    this.notes.push(note);
  }

  getNotes() {
    return this.notes;
  }

  replayOrder: number = 60;
  serialize(): SerialiedCombatLogCargoTransfer {
    return {
      logEntryClass: this.constructor.name,
      notes: this.notes,
    };
  }

  deserialize(unknownData: Record<string, unknown>) {
    const data = unknownData as SerialiedCombatLogCargoTransfer;

    this.notes = data.notes;

    return this;
  }
}
