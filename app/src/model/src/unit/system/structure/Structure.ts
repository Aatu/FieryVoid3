import ShipSystem, { SystemArgs } from "../ShipSystem.js";
import CargoBaySystemStrategy from "../strategy/CargoBaySystemStrategy.js";
import StoreHeatStrategy from "../strategy/StoreHeatStrategy.js";
import RadiateHeatStrategy from "../strategy/RadiateHeatStrategy.js";
import FuelTankSystemStrategy from "../strategy/FuelTankSystemStrategy.js";

type StructureArgs = SystemArgs & {
  cargoSpace?: number;
  heatStorage?: number;
  radiator?: number;
  fuel?: number;
};

class Structure extends ShipSystem {
  constructor({
    cargoSpace = 0,
    heatStorage = 0,
    radiator = 0,
    fuel = 0,
    ...args
  }: StructureArgs) {
    super(args);

    if (cargoSpace) {
      this.addStrategy(new CargoBaySystemStrategy(cargoSpace));
    }

    if (heatStorage) {
      this.addStrategy(new StoreHeatStrategy(heatStorage));
    }

    if (radiator) {
      this.addStrategy(new RadiateHeatStrategy(radiator));
    }

    if (fuel) {
      this.addStrategy(new FuelTankSystemStrategy(fuel));
    }
  }

  getDisplayName(): string {
    return "Structure";
  }
}

export default Structure;
