import DamageEntry from "../DamageEntry";
import ShipSystem from "../ShipSystem";
import ShipSystemLogEntry, {
  SerializedSystemLogEntry,
} from "./ShipSystemLogEntry";

export type SerializedShipSystemLogEntryDamage = SerializedSystemLogEntry & {
  blockedByArmor?: number;
  damage?: number;
  wasDestroyed?: boolean;
};

class ShipSystemLogEntryDamage extends ShipSystemLogEntry {
  private damage: number;
  private blockedByArmor: number;
  private wasDestroyed: boolean;

  constructor(system: ShipSystem) {
    super(system);

    this.damage = 0;
    this.blockedByArmor = 0;
    this.wasDestroyed = false;
  }

  addDamage(damageEntry: DamageEntry) {
    this.damage += damageEntry.amount;
    this.blockedByArmor += damageEntry.armor;
    if (damageEntry.destroyedSystem) {
      this.wasDestroyed = true;
    }
  }

  serialize(): SerializedShipSystemLogEntryDamage {
    return {
      ...super.serialize(),
      blockedByArmor: this.blockedByArmor,
      damage: this.damage,
      wasDestroyed: this.wasDestroyed,
    };
  }

  deserialize(data: SerializedShipSystemLogEntryDamage = {}) {
    super.deserialize(data);
    this.blockedByArmor = data.blockedByArmor || 0;
    this.damage = data.damage || 0;
    this.wasDestroyed = data.wasDestroyed || false;

    return this;
  }

  getMessage(): string[] {
    const messages = [
      `Suffered ${this.damage} points of damge. Armor blocked ${this.blockedByArmor} points.`,
    ];

    if (this.wasDestroyed) {
      messages.push(`System was destroyed`);
    }

    return messages;
  }
}

export default ShipSystemLogEntryDamage;
