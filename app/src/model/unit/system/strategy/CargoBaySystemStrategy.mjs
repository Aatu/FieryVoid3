import ShipSystemStrategy from "./ShipSystemStrategy.mjs";
import { cargoClasses } from "../cargo/cargo.mjs";

class CargoBaySystemStrategy extends ShipSystemStrategy {
  constructor(space) {
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
          list: this.cargo.map(cargo => ({
            cargo: cargo.object,
            amount: cargo.amount
          }))
        }
      }
    ];
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      cargoBaySystemStrategy: this.cargo.map(cargo => ({
        className: cargo.object.constructor.name,
        amount: cargo.amount
      }))
    };
  }

  deserialize(data = {}) {
    this.cargo = data.cargoBaySystemStrategy
      ? data.cargoBaySystemStrategy.map(data => ({
          object: new cargoClasses[data.className](),
          amount: data.amount
        }))
      : [];

    return this;
  }

  getTotalCargoSpace() {
    return this.space;
  }

  hasCargoSpaceAvailable() {
    return this.getTotalCargoSpace();
  }

  getCargoEntry(cargo) {
    return this.cargo.find(
      stored => stored.object.constructor === cargo.constructor
    );
  }

  getCargoByParentClass(parentClass) {
    return this.cargo.filter(cargo => cargo.object instanceof parentClass);
  }

  hasCargo({ cargo, amount = 1 }) {
    const entry = this.getCargoEntry(cargo);

    if (!entry) {
      return false;
    }

    return entry.amount >= amount;
  }

  removeCargo({ cargo, amount = 1 }) {
    const entry = this.getCargoEntry(cargo);

    if (!entry || entry.amount < amount) {
      throw new Error("Check hasCargo first!");
    }

    entry.amount -= amount;

    this.cargo = this.cargo.filter(entry => entry.amount > 0);
  }

  addCargo({ cargo, amount = 1 }) {
    let entry = this.getCargoEntry(cargo);

    if (entry) {
      entry.amount += amount;
    } else {
      entry = {
        object: new cargoClasses[cargo.constructor.name](),
        amount
      };

      this.cargo.push(entry);
    }
  }
}

export default CargoBaySystemStrategy;
