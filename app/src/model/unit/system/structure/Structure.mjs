import ShipSystem from "../ShipSystem.mjs";
import CargoBaySystemStrategy from "../strategy/CargoBaySystemStrategy.mjs";
import StoreHeatStrategy from "../strategy/StoreHeatStrategy.mjs";
import RadiateHeatStrategy from "../strategy/RadiateHeatStrategy.mjs";

class Structure extends ShipSystem {
  constructor({ cargoSpace = 0, heatStorage = 0, radiator = 0, ...args }) {
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
  }

  getDisplayName() {
    return "Structure";
  }
}

export default Structure;
