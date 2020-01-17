import ShipSystemLogEntry from "./ShipSystemLogEntry.mjs";

class ShipSystemLogEntryHeat extends ShipSystemLogEntry {
  constructor(system) {
    super(system);

    this.initialOverheat = 0;
    this.initialOverheatPercentage = 0;
    this.heatGenerated = 0;
    this.heatCooled = 0;
    this.heatRadiated = 0;
    this.overheat = 0;
    this.overheatPercentage = 0;
    this.isForcedOffline = 0;
    this.intialHeatStored = 0;
    this.newHeatStored = 0;
    this.heatGivenToRadiators = 0;
  }

  setIntialHeatStored(heat) {
    this.intialHeatStored = heat;
  }

  addNewHeatStored(amount) {
    this.newHeatStored += amount;
  }

  addHeatGivenToRadiators(amount) {
    this.heatGivenToRadiators += amount;
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
      isForcedOffline: this.isForcedOffline,
      intialHeatStored: this.intialHeatStored,
      newHeatStored: this.newHeatStored,
      heatGivenToRadiators: this.heatGivenToRadiators
    };
  }

  deserialize(data = {}) {
    super.deserialize(data);
    this.initialOverheat = data.initialOverheat || 0;
    this.initialOverheatPercentage = data.initialOverheatPercentage || 0;
    this.heatGenerated = data.heatGenerated || 0;
    this.heatCooled = data.heatCooled || 0;
    this.heatRadiated = data.heatRadiated || 0;
    this.overheat = data.overheat || 0;
    this.overheatPercentage = data.overheatPercentage || 0;
    this.isForcedOffline = data.isForcedOffline || 0;
    this.intialHeatStored = data.intialHeatStored || 0;
    this.newHeatStored = data.newHeatStored || 0;
    this.heatGivenToRadiators = data.heatGivenToRadiators || 0;

    return this;
  }

  getMessage() {
    let messages = [];

    const isRadiator = this.system.callHandler("isRadiator", null, false);
    const isStorage = this.system.heat.isHeatStorage();

    if (isStorage) {
      messages = [...messages, ...this.getHeatStorageMessage()];
    }

    if (isRadiator) {
      messages = [...messages, ...this.getRadiatorMessage()];
    }

    if (!isRadiator && !isStorage) {
      messages = [...messages, ...this.getRegularMessage()];
    }

    return messages;
  }

  getRadiatorMessage() {
    if (this.heatRadiated) {
      return [`Radiated ${Math.round(this.heatRadiated)} units of heat.`];
    }

    return [];
  }

  getHeatStorageMessage() {
    const messages = [];

    if (this.heatGivenToRadiators || this.newHeatStored) {
      messages.push(
        `Added ${this.newHeatStored} units of heat. Transfered ${this.heatGivenToRadiators} units of heat to radiators.`
      );
    }

    messages.push(
      `Stored ${this.intialHeatStored +
        this.newHeatStored -
        this.heatGivenToRadiators} units of heat.`
    );

    return messages;
  }

  getRegularMessage() {
    const messages = [];

    if (this.heatGenerated || this.heatCooled) {
      messages.push(
        `Added ${Math.round(this.heatGenerated)} and cooled ${Math.round(
          this.heatCooled
        )} units of heat.`
      );
    }

    let heatMessage = `Current system heat was ${Math.round(this.overheat)}.`;

    messages.push();

    if (this.overheat) {
      heatMessage += ` Overheating ${Math.round(
        this.overheatPercentage * 100
      )}%.`;
    }

    messages.push(heatMessage);
    if (this.isForcedOffline) {
      messages.push(`System forced offline until overheat is less than 50%.`);
    }

    return messages;
  }
}

export default ShipSystemLogEntryHeat;
