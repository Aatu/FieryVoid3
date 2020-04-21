import ShipSystem from "../ShipSystem.mjs";
import CargoBaySystemStrategy from "../strategy/CargoBaySystemStrategy.mjs";
import StoreHeatStrategy from "../strategy/StoreHeatStrategy.mjs";
import RadiateHeatStrategy from "../strategy/RadiateHeatStrategy.mjs";
import FuelTankSystemStrategy from "../strategy/FuelTankSystemStrategy.mjs";

class Structure extends ShipSystem {
  constructor({
    cargoSpace = 0,
    heatStorage = 0,
    radiator = 0,
    fuel = 0,
    ...args
  }) {
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

  getDisplayName() {
    return "Structure";
  }
}

export default Structure;
