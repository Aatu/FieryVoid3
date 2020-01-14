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
      entry = new className();
      this.log.push(entry);
    }

    return entry;
  }

  serialize() {
    return {
      log: this.log.map(entry => entry.serialize())
    };
  }

  deserialize(data = {}) {
    this.log = data.log || [];
    this.log = this.log.map(entry =>
      new systemLogEntryClasses[entry.className]().deserialize(entry)
    );

    return this;
  }

  addEntry() {}
}

export default ShipSystemLog;
