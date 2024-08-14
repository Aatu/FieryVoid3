import { systemLogEntryClasses } from "./systemLogEntryClasses";
import ShipSystemLogEntry, {
  SerializedSystemLogEntry,
} from "./ShipSystemLogEntry";
import ShipSystem from "../ShipSystem";

export type SerializedShipSystemLog = {
  log?: SerializedSystemLogEntry[];
};

class ShipSystemLog {
  private system: ShipSystem;
  private log: ShipSystemLogEntry[];

  constructor(system: ShipSystem) {
    this.system = system;

    this.log = [];
  }

  getGenericLogEntry() {
    const entry = new ShipSystemLogEntry(this.system);
    this.log.push(entry);
    return entry;
  }

  getOpenLogEntryByClass<T extends ShipSystemLogEntry>(
    className: typeof ShipSystemLogEntry
  ): T {
    let entry = this.log
      .filter((entry) => entry.isOpen())
      .find((entry) => entry instanceof className);

    if (!entry) {
      entry = new className(this.system);
      this.log.push(entry);
    }

    return entry as T;
  }

  serialize() {
    return {
      log: this.log.map((entry) => entry.serialize()),
    };
  }

  getMessagesForTurn(turn: number) {
    return this.log
      .filter((entry) => entry.isTurn(turn))
      .reduce((all, entry) => [...all, ...entry.getMessage()], [] as string[]);
  }

  getWithTurns() {
    const turns: {
      turn: number;
      messages: string[];
    }[] = [];

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

  deserialize(data: SerializedShipSystemLog = {}) {
    const log = (data?.log || [])
      .map((entry) => {
        if (!entry.className) {
          return null;
        }

        // @ts-expect-error dunno how to fix this
        return new systemLogEntryClasses[entry.className as key](
          this.system
        ).deserialize(entry);
      })
      .filter(Boolean);

    this.log = log;

    return this;
  }

  endTurn(turn: number) {
    this.log
      .filter((entry) => entry.isOpen())
      .forEach((entry) => entry.setTurn(turn));
  }

  advanceTurn(turn: number) {}
}

export default ShipSystemLog;
