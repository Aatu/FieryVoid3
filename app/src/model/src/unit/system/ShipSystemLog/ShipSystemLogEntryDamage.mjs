import ShipSystemLogEntry from "./ShipSystemLogEntry.mjs";

class ShipSystemLogEntryDamage extends ShipSystemLogEntry {
  constructor(system) {
    super(system);

    this.damage = 0;
    this.blockedByArmor = 0;
    this.wasDestroyed = false;
  }

  addDamage(damageEntry) {
    this.damage += damageEntry.amount;
    this.blockedByArmor += damageEntry.armor;
    if (damageEntry.destroyedSystem) {
      this.wasDestroyed = true;
    }
  }

  serialize() {
    return {
      ...super.serialize(),
      blockedByArmor: this.blockedByArmor,
      damage: this.damage,
      wasDestroyed: this.wasDestroyed
    };
  }

  deserialize(data = {}) {
    super.deserialize(data);
    this.blockedByArmor = data.blockedByArmor || 0;
    this.damage = data.damage || 0;
    this.wasDestroyed = data.wasDestroyed || false;

    return this;
  }

  getMessage() {
    const messages = [
      `Suffered ${this.damage} points of damge. Armor blocked ${this.addBlockedByArmor} points.`
    ];

    if (this.wasDestroyed) {
      messages.push(`System was destroyed`);
    }

    return messages;
  }
}

export default ShipSystemLogEntryDamage;
