import ShipSystemLogEntry, { SerializedSystemLogEntry } from "./ShipSystemLogEntry";
import ShipSystem from "../ShipSystem";
export type SerializedShipSystemLog = {
    log?: SerializedSystemLogEntry[];
};
declare class ShipSystemLog {
    private system;
    private log;
    constructor(system: ShipSystem);
    getGenericLogEntry(): ShipSystemLogEntry;
    getOpenLogEntryByClass<T extends ShipSystemLogEntry>(className: typeof ShipSystemLogEntry): T;
    serialize(): {
        log: SerializedSystemLogEntry[];
    };
    getMessagesForTurn(turn: number): string[];
    getWithTurns(): {
        turn: number;
        messages: string[];
    }[];
    deserialize(data?: SerializedShipSystemLog): this;
    endTurn(turn: number): void;
    advanceTurn(turn: number): void;
}
export default ShipSystemLog;
