import { systemLogEntryClasses } from "./systemLogEntryClasses.mjs";

class ShipSystemLog {
  constructor(system) {
    this.system = system;

    this.log = [];
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
