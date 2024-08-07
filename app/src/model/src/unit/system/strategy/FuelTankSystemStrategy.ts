import ShipSystemStrategy from "./ShipSystemStrategy.js";

export type SerializedFuelTankSystemStrategy = {
  fuelTankSystemStrategy?: {
    fuel?: number;
  };
};

class FuelTankSystemStrategy extends ShipSystemStrategy {
  private space: number;
  private fuel: number;

  constructor(space: number) {
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

  setFuel(fuel: number) {
    if (fuel > this.space) {
      throw new Error("No space for fuel");
    }
    this.fuel = fuel;
  }

  takeFuel(amount: number) {
    if (amount > this.fuel) {
      throw new Error("Trying to take more fuel than exists");
    }

    this.fuel -= amount;
  }

  addFuel(amount: number) {
    if (this.fuel + amount > this.space) {
      throw new Error("No space for fuel");
    }
    this.fuel += amount;
  }

  getUiComponents(payload: unknown, previousResponse = []) {
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

  serialize(payload: unknown, previousResponse = []) {
    return {
      ...previousResponse,
      fuelTankSystemStrategy: {
        fuel: this.fuel,
      },
    };
  }

  deserialize(data: SerializedFuelTankSystemStrategy = {}) {
    this.fuel = data?.fuelTankSystemStrategy?.fuel || 0;

    return this;
  }
}

export default FuelTankSystemStrategy;
