import ShipSystemLogEntry from "./ShipSystemLogEntry.mjs";

class ShipSystemLogEntryCriticalHit extends ShipSystemLogEntry {
  constructor(system) {
    super(system);

    this.newDamagePoints = 0;
    this.overHeatPoints = 0;
    this.oldDamagePoints = 0;
    this.criticalMessage = "";
    this.extraPoints = 0;
  }

  setExtraPoints(amount) {
    this.extraPoints = amount;
  }

  setNewDamagePoints(damage) {
    this.newDamagePoints = damage;
  }

  setOldDamagePoints(damage) {
    this.oldDamagePoints = damage;
  }

  setOverHeatPoints(amount) {
    this.overHeatPoints += amount;
  }

  setCriticalMessage(message) {
    this.criticalMessage = message;
  }

  serialize() {
    return {
      ...super.serialize(),
      newDamagePoints: this.newDamagePoints,
      overHeatPoints: this.overHeatPoints,
      oldDamagePoints: this.oldDamagePoints,
      criticalMessage: this.criticalMessage,
      extraPoints: this.extraPoints
    };
  }

  deserialize(data = {}) {
    super.deserialize(data);
    this.newDamagePoints = data.newDamagePoints || 0;
    this.overHeatPoints = data.overHeatPoints || 0;
    this.oldDamagePoints = data.oldDamagePoints || 0;
    this.criticalMessage = data.criticalMessage || "";
    this.extraPoints = data.extraPoints || 0;

    return this;
  }

  getMessage() {
    const messages = [
      `Tested for critical damage:`,
      `Existing damage: ${this.oldDamagePoints}, new: ${
        this.newDamagePoints
      }, overheat: ${this.overHeatPoints}, random: ${
        this.extraPoints
      }, total: ${this.oldDamagePoints +
        this.newDamagePoints +
        this.overHeatPoints +
        this.extraPoints}`
    ];

    if (this.criticalMessage) {
      messages.push(`Resulted in critical:`);
      messages.push(`"${this.criticalMessage}"`);
    }

    return messages;
  }
}

export default ShipSystemLogEntryCriticalHit;
