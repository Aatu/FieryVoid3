import ShipSystemStrategy from "./ShipSystemStrategy.js";
import {
  cargoClasses,
  CargoType,
  createCargoInstance,
} from "../cargo/cargo.js";
import CargoEntity from "../cargo/CargoEntity.js";

export type SerializedCargoBaySystemStrategy = {
  cargoBaySystemStrategy?: { className: CargoType; amount: number }[];
};
class CargoBaySystemStrategy extends ShipSystemStrategy {
  private space: number;
  private cargo: { object: CargoEntity; amount: number }[];

  constructor(space: number) {
    super();
    this.space = space;
    this.cargo = [];
  }

  getUiComponents(payload: unknown, previousResponse = []) {
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

  serialize(
    payload: unknown,
    previousResponse = {}
  ): SerializedCargoBaySystemStrategy {
    return {
      ...previousResponse,
      cargoBaySystemStrategy: this.cargo.map((cargo) => ({
        className: cargo.object.getCargoClassName(),
        amount: cargo.amount,
      })),
    };
  }

  deserialize(data: SerializedCargoBaySystemStrategy = {}) {
    this.cargo = data.cargoBaySystemStrategy
      ? data.cargoBaySystemStrategy.map((data) => ({
          object: createCargoInstance(data.className),
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

  hasSpaceFor({ object, amount }: { object: CargoEntity; amount: number }) {
    if (this.getSystem().isDestroyed()) {
      return false;
    }

    return this.getAvailableCargoSpace() >= object.getSpaceRequired() * amount;
  }

  getCargoEntry(object: CargoEntity) {
    if (this.getSystem().isDestroyed()) {
      return undefined;
    }

    return this.cargo.find(
      (stored) => stored.object.constructor === object.constructor
    );
  }

  getCargoByParentClass(parentClass: typeof CargoEntity) {
    if (this.getSystem().isDestroyed()) {
      return [];
    }

    return this.cargo.filter((cargo) => cargo.object instanceof parentClass);
  }

  hasCargo({ object, amount = 1 }: { object: CargoEntity; amount: number }) {
    if (this.getSystem().isDestroyed()) {
      return false;
    }

    const entry = this.getCargoEntry(object);

    if (!entry) {
      return false;
    }

    return entry.amount >= amount;
  }

  removeCargo({ object, amount = 1 }: { object: CargoEntity; amount: number }) {
    const entry = this.getCargoEntry(object);

    if (!entry || entry.amount < amount) {
      throw new Error("Check hasCargo first!");
    }

    entry.amount -= amount;

    this.cargo = this.cargo.filter((entry) => entry.amount > 0);
  }

  addCargo({ object, amount = 1 }: { object: CargoEntity; amount: number }) {
    if (!this.hasSpaceFor({ object, amount })) {
      throw new Error("No space in cargo bay");
    }

    let entry = this.getCargoEntry(object);

    if (entry) {
      entry.amount += amount;
    } else {
      entry = {
        object: createCargoInstance(object.getCargoClassName()),
        amount,
      };

      this.cargo.push(entry);
    }
  }
}

export default CargoBaySystemStrategy;
