import ShipSystemLogEntry from "./ShipSystemLogEntry.mjs";

class ShipSystemLogEntryHeat extends ShipSystemLogEntry {
  constructor() {
    super();

    this.initialOverheat = 0;
    this.initialOverheatPercentage = 0;
    this.heatGenerated = null;
    this.heatCooled = null;
    this.heatRadiated = null;
    this.overheat = null;
    this.overheatPercentage = null;
    this.isForcedOffline = null;
  }

  setInitialOverheat(heat, percentage) {
    this.initialOverheat = heat;
    this.initialOverheatPercentage = percentage;
  }

  setHeatGenerated(heat) {
    this.heatGenerated = heat;
  }

  setNewOverheat(heat, percentage) {
    this.overheat = heat;
    this.overheatPercentage = percentage;

    this.heatCooled = this.heatGenerated + this.initialOverheat - this.overheat;
  }

  setHeatRadiated(heat) {
    this.heatRadiated = heat;
  }

  setForcedOffline() {
    this.isForcedOffline = true;
  }

  serialize() {
    return {
      ...super.serialize(),
      initialOverheat: this.initialOverheat,
      initialOverheatPercentage: this.initialOverheatPercentage,
      heatGenerated: this.heatGenerated,
      heatCooled: this.heatCooled,
      heatRadiated: this.heatRadiated,
      overheat: this.overheat,
      overheatPercentage: this.overheatPercentage,
      isForcedOffline: this.isForcedOffline
    };
  }

  deserialize(data = {}) {
    super.deserialize(data);
    this.initialOverheat = data.initialOverheat || 0;
    this.initialOverheatPercentage = data.initialOverheatPercentage || 0;
    this.heatGenerated = data.heatGenerated || null;
    this.heatCooled = data.heatCooled || null;
    this.heatRadiated = data.heatRadiated || null;
    this.overheat = data.overheat || null;
    this.overheatPercentage = data.overheatPercentage || null;
    this.isForcedOffline = data.isForcedOffline || null;

    return this;
  }

  getMessage() {
    return [
      `Initial overheat: ${this.initialOverheat}`,
      this.heatGenerated ? `Heat generated: ${this.heatGenerated}` : null,
      this.heatCooled ? `Cooled: ${this.heatCooled}` : null,
      this.heatRadiated ? `Heat radiated: ${this.heatRadiated}` : null,
      this.overheat ? `Overheating: ${this.overheat}%` : null,
      this.isForcedOffline
        ? `forced offline for ${this.isForcedOffline} turns.`
        : null
    ];
  }
}

export default ShipSystemLogEntryHeat;
