import ShipSystemStrategy from "./ShipSystemStrategy.js";
import { cargoClasses } from "../cargo/cargo.mjs";

class CargoBaySystemStrategy extends ShipSystemStrategy {
  private space: number;

  constructor(space: number) {
    super();
    this.space = space;
    this.cargo = [];
  }

  getUiComponents(payload, previousResponse = []) {
    return [
      ...previousResponse,
      {
        name: "CargoList",
        props: {
          list: this.cargo.map((cargo) => ({
            object: cargo.object,
            amount: cargo.amount,
          })),
        },
      },
    ];
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      cargoBaySystemStrategy: this.cargo.map((cargo) => ({
        className: cargo.object.constructor.name,
        amount: cargo.amount,
      })),
    };
  }

  deserialize(data = {}) {
    this.cargo = data.cargoBaySystemStrategy
      ? data.cargoBaySystemStrategy.map((data) => ({
          object: new cargoClasses[data.className](),
          amount: data.amount,
        }))
      : [];

    return this;
  }

  getTotalCargoSpace() {
    return this.space;
  }

  getAvailableCargoSpace() {
    return this.space - this.getCargoSpaceUsed();
  }

  getCargoSpaceUsed() {
    return this.cargo.reduce(
      (total, { object, amount }) => total + object.getSpaceRequired() * amount,
      0
    );
  }

  hasSpaceFor({ object, amount }) {
    if (this.system.isDestroyed()) {
      return false;
    }

    return this.getAvailableCargoSpace() >= object.getSpaceRequired() * amount;
  }

  getCargoEntry(object) {
    if (this.system.isDestroyed()) {
      return undefined;
    }

    return this.cargo.find(
      (stored) => stored.object.constructor === object.constructor
    );
  }

  getCargoByParentClass(parentClass) {
    if (this.system.isDestroyed()) {
      return [];
    }

    return this.cargo.filter((cargo) => cargo.object instanceof parentClass);
  }

  hasCargo({ object, amount = 1 }) {
    if (this.system.isDestroyed()) {
      return false;
    }

    const entry = this.getCargoEntry(object);

    if (!entry) {
      return false;
    }

    return entry.amount >= amount;
  }

  removeCargo({ object, amount = 1 }) {
    const entry = this.getCargoEntry(object);

    if (!entry || entry.amount < amount) {
      throw new Error("Check hasCargo first!");
    }

    entry.amount -= amount;

    this.cargo = this.cargo.filter((entry) => entry.amount > 0);
  }

  addCargo({ object, amount = 1 }) {
    if (!this.hasSpaceFor({ object, amount })) {
      throw new Error("No space in cargo bay");
    }

    let entry = this.getCargoEntry(object);

    if (entry) {
      entry.amount += amount;
    } else {
      entry = {
        object: new cargoClasses[object.constructor.name](),
        amount,
      };

      this.cargo.push(entry);
    }
  }
}

export default CargoBaySystemStrategy;
