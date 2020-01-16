import { systemLogEntryClasses } from "./systemLogEntryClasses.mjs";

class ShipSystemLog {
  constructor(system) {
    this.system = system;

    this.log = [];
  }

  getOpenLogEntryByClass(className) {
    let entry = this.log
      .filter(entry => entry.isOpen())
      .find(entry => entry instanceof className);

    if (!entry) {
      entry = new className(this.system);
      this.log.push(entry);
    }

    return entry;
  }

  serialize() {
    return {
      log: this.log.map(entry => entry.serialize())
    };
  }

  getMessagesForTurn(turn) {
    return this.log
      .filter(entry => entry.isTurn(turn))
      .reduce((all, entry) => [...all, ...entry.getMessage()], []);
  }

  deserialize(data = {}) {
    this.log = data.log || [];
    this.log = this.log.map(entry =>
      new systemLogEntryClasses[entry.className](this.system).deserialize(entry)
    );

    return this;
  }

  endTurn(turn) {
    this.log
      .filter(entry => entry.isOpen())
      .forEach(entry => entry.setTurn(turn));
  }

  advanceTurn(turn) {}
}

export default ShipSystemLog;
