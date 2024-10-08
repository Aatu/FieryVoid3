import { v4 as uuidv4 } from "uuid";
import ShipSystem from "./ShipSystem";

export type SerializedDamageEntry = {
  amount: number;
  armor: number;
  id: string;
  destroyedSystem: boolean;
};

class DamageEntry {
  public amount: number;
  public armor: number;
  public id: string;
  public destroyedSystem: boolean;
  public system: ShipSystem | null;
  public new: boolean;

  constructor(amount = 0, armor = 0) {
    if (
      !Number.isInteger(amount) ||
      Number.isNaN(amount) ||
      !Number.isInteger(armor) ||
      Number.isNaN(armor)
    ) {
      throw new Error(
        `Trying to construct damageEntry with invalid damage or armor ${amount}, ${armor}`
      );
    }
    this.amount = amount;
    if (this.amount < 0) {
      this.amount = 0;
    }
    this.armor = armor;
    this.id = uuidv4();
    this.destroyedSystem = false;

    this.system = null;
    this.new = true;
  }

  isNew() {
    return this.new;
  }

  setSystem(system: ShipSystem) {
    this.system = system;
  }

  setDestroyedSystem() {
    this.destroyedSystem = true;
  }

  serialize(): SerializedDamageEntry {
    return {
      amount: this.amount,
      armor: this.armor,
      id: this.id,
      destroyedSystem: this.destroyedSystem,
    };
  }

  deserialize(data: SerializedDamageEntry) {
    this.id = data.id || uuidv4();
    this.amount = data.amount || 0;
    this.armor = data.armor || 0;
    this.destroyedSystem = data.destroyedSystem || false;
    this.new = false;

    if (
      !Number.isInteger(this.amount) ||
      Number.isNaN(this.amount) ||
      !Number.isInteger(this.armor) ||
      Number.isNaN(this.armor)
    ) {
      throw new Error(
        `Trying to deserialize damageEntry with invalid damage or armor ${this.amount}, ${this.armor}`
      );
    }

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
