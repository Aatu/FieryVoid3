import ShipSystem from "../ShipSystem";
import ShipSystemLogEntry, {
  SerializedSystemLogEntry,
} from "./ShipSystemLogEntry";

type SerializedSystemLogEntryCriticalHit = SerializedSystemLogEntry & {
  newDamagePoints?: number;
  overHeatPoints?: number;
  oldDamagePoints?: number;
  criticalMessage?: string;
  extraPoints?: number;
};

class ShipSystemLogEntryCriticalHit extends ShipSystemLogEntry {
  private newDamagePoints: number;
  private overHeatPoints: number;
  private oldDamagePoints: number;
  private criticalMessage: string;
  private extraPoints: number;

  constructor(system: ShipSystem) {
    super(system);

    this.newDamagePoints = 0;
    this.overHeatPoints = 0;
    this.oldDamagePoints = 0;
    this.criticalMessage = "";
    this.extraPoints = 0;
  }

  setExtraPoints(amount: number) {
    this.extraPoints = amount;
  }

  setNewDamagePoints(damage: number) {
    this.newDamagePoints = damage;
  }

  setOldDamagePoints(damage: number) {
    this.oldDamagePoints = damage;
  }

  setOverHeatPoints(amount: number) {
    this.overHeatPoints += amount;
  }

  setCriticalMessage(message: string) {
    this.criticalMessage = message;
  }

  serialize(): SerializedSystemLogEntryCriticalHit {
    return {
      ...super.serialize(),
      newDamagePoints: this.newDamagePoints,
      overHeatPoints: this.overHeatPoints,
      oldDamagePoints: this.oldDamagePoints,
      criticalMessage: this.criticalMessage,
      extraPoints: this.extraPoints,
    };
  }

  deserialize(data: SerializedSystemLogEntryCriticalHit = {}) {
    super.deserialize(data);
    this.newDamagePoints = data.newDamagePoints || 0;
    this.overHeatPoints = data.overHeatPoints || 0;
    this.oldDamagePoints = data.oldDamagePoints || 0;
    this.criticalMessage = data.criticalMessage || "";
    this.extraPoints = data.extraPoints || 0;

    return this;
  }

  getMessage(): string[] {
    const messages = [
      `Tested for critical damage:`,
      `Existing damage: ${this.oldDamagePoints}, new: ${
        this.newDamagePoints
      }, overheat: ${this.overHeatPoints}, random: ${
        this.extraPoints
      }, total: ${
        this.oldDamagePoints +
        this.newDamagePoints +
        this.overHeatPoints +
        this.extraPoints
      }`,
    ];

    if (this.criticalMessage) {
      messages.push(`Resulted in critical:`);
      messages.push(`"${this.criticalMessage}"`);
    }

    return messages;
  }
}

export default ShipSystemLogEntryCriticalHit;
