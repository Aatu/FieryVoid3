import { systemLogEntryClasses } from "./systemLogEntryClasses";
import ShipSystemLogEntry from "./ShipSystemLogEntry";
class ShipSystemLog {
    system;
    log;
    constructor(system) {
        this.system = system;
        this.log = [];
    }
    getGenericLogEntry() {
        const entry = new ShipSystemLogEntry(this.system);
        this.log.push(entry);
        return entry;
    }
    getOpenLogEntryByClass(className) {
        let entry = this.log
            .filter((entry) => entry.isOpen())
            .find((entry) => entry instanceof className);
        if (!entry) {
            entry = new className(this.system);
            this.log.push(entry);
        }
        return entry;
    }
    serialize() {
        return {
            log: this.log.map((entry) => entry.serialize()),
        };
    }
    getMessagesForTurn(turn) {
        return this.log
            .filter((entry) => entry.isTurn(turn))
            .reduce((all, entry) => [...all, ...entry.getMessage()], []);
    }
    getWithTurns() {
        const turns = [];
        this.log.forEach((entry) => {
            let turnEntry = turns.find((turnEntry) => turnEntry.turn === entry.turn);
            if (entry.turn === null) {
                return;
            }
            if (!turnEntry) {
                turnEntry = {
                    turn: entry.turn,
                    messages: [],
                };
                turns.push(turnEntry);
            }
            turnEntry.messages = [...turnEntry.messages, ...entry.getMessage()];
        });
        return turns;
    }
    deserialize(data = {}) {
        const log = (data?.log || [])
            .map((entry) => {
            if (!entry.className) {
                return null;
            }
            // @ts-expect-error dunno how to fix this
            return new systemLogEntryClasses[entry.className](this.system).deserialize(entry);
        })
            .filter(Boolean);
        this.log = log;
        return this;
    }
    endTurn(turn) {
        this.log
            .filter((entry) => entry.isOpen())
            .forEach((entry) => entry.setTurn(turn));
    }
    advanceTurn(turn) { }
}
export default ShipSystemLog;
