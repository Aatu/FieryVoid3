import { ICombatLogEntry } from "./combatLogClasses";
type SerialiedCombatLogCargoTransfer = {
    logEntryClass: string;
    notes: string[];
};
export declare class CombatLogCargoTransfer implements ICombatLogEntry {
    private notes;
    addNote(note: string): void;
    getNotes(): string[];
    replayOrder: number;
    serialize(): SerialiedCombatLogCargoTransfer;
    deserialize(unknownData: Record<string, unknown>): this;
}
export {};
