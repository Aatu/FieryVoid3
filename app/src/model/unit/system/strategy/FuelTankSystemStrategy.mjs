import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class FuelTankSystemStrategy extends ShipSystemStrategy {
  constructor(space) {
    super();
    this.space = space;
    this.fuel = 0;
  }

  getFuel() {
    return this.fuel;
  }

  getFuelSpace() {
    return this.space;
  }

  setMaxFuel() {
    this.fuel = this.space;
  }

  setFuel(fuel) {
    if (fuel > this.space) {
      throw new Error("No space for fuel");
    }
    this.fuel = fuel;
  }

  takeFuel(amount) {
    if (amount > this.fuel) {
      throw new Error("Trying to take more fuel than exists");
    }

    this.fuel -= amount;
  }

  addFuel(amount) {
    if (this.fuel + amount > this.space) {
      throw new Error("No space for fuel");
    }
    this.fuel += amount;
  }

  getUiComponents(payload, previousResponse = []) {
    return [
      ...previousResponse,
      {
        name: "SystemFuelBar",
        props: {
          space: this.space,
          fuel: this.fuel,
        },
      },
    ];
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      fuelTankSystemStrategy: {
        fuel: this.fuel,
      },
    };
  }

  deserialize(data = {}) {
    this.fuel = data.fuelTankSystemStrategy
      ? data.fuelTankSystemStrategy.fuel
      : 0;

    return this;
  }
}

export default FuelTankSystemStrategy;
