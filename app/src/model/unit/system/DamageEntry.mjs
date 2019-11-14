import uuidv4 from "uuid/v4.js";

class DamageEntry {
  constructor(amount, armor = 0, fireId) {
    this.amount = amount;
    if (this.amount < 0) {
      this.amount = 0;
    }
    this.armor = armor;
    this.fireId = fireId || null;
    this.id = uuidv4();
    this.destroyedSystem = false;

    this.system = null;
  }

  setSystem(system) {
    this.system = system;
  }

  setDestroyedSystem() {
    this.destroyedSystem = true;
  }

  serialize() {
    return {
      amount: this.amount,
      armor: this.armor,
      fireId: this.fireId,
      id: this.id,
      destroyedSystem: this.destroyedSystem
    };
  }

  deserialize(data) {
    this.id = data.id || uuidv4();
    this.amount = data.amount || 0;
    this.armor = data.armor || 0;
    this.fireId = data.fireId || null;
    this.destroyedSystem = data.destroyedSystem || false;

    return this;
  }

  getDamage() {
    return this.amount;
  }

  advanceTurn() {
    return this;
  }
}

export default DamageEntry;
