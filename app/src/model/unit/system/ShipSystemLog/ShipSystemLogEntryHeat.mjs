import ShipSystemLogEntry from "./ShipSystemLogEntry.mjs";

class ShipSystemLogEntryHeat extends ShipSystemLogEntry {
  constructor() {
    super();

    this.initialHeat = 0;
    this.heatGenerated = null;
    this.heatCooled = null;
    this.heatRadiated = null;
    this.overheat = null;
    this.forcedOfflineTurns = null;
  }

  setInitialHeat(heat) {
    this.initialHeat = heat;
  }

  setHeatGenerated(heat) {
    this.heatGenerated = heat;
  }

  setNewOverheat(heat) {
    this.overheat = heat;
  }

  serialize() {
    return {
      ...super.serialize(),
      initialHeat: this.initialHeat,
      heatGenerated: this.heatGenerated,
      heatCooled: this.heatCooled,
      heatRadiated: this.heatRadiated,
      overheat: this.overheat,
      forcedOfflineTurns: this.forcedOfflineTurns
    };
  }

  deserialize(data = {}) {
    super.deserialize(data);
    this.initialHeat = data.initialHeat || 0;
    this.heatGenerated = data.heatGenerated || null;
    this.heatCooled = data.heatCooled || null;
    this.heatRadiated = data.heatRadiated || null;
    this.overheat = data.overheat || null;
    this.forcedOfflineTurns = data.forcedOfflineTurns || null;

    return this;
  }

  getMessage() {
    return [
      `Initial heat: ${this.initialHeat}`,
      this.heatGenerated ? `Heat generated: ${this.heatGenerated}` : null,
      this.heatCooled ? `Cooled: ${this.heatCooled}` : null,
      this.heatRadiated ? `Heat radiated: ${this.heatRadiated}` : null,
      this.overheat ? `Overheating: ${this.overheat}%` : null,
      this.forcedOfflineTurns
        ? `forced offline for ${this.forcedOfflineTurns} turns.`
        : null
    ];
  }
}

export default ShipSystemLogEntryHeat;
