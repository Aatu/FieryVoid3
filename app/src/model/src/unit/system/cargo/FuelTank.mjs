import ShipSystem from "../ShipSystem.mjs";
import { FuelTankSystemStrategy } from "../strategy/index.mjs";

class FuelTank extends ShipSystem {
  constructor(args, space) {
    super(args, [new FuelTankSystemStrategy(space)]);
  }

  getDisplayName() {
    return `Fuel tank ${this.callHandler("getFuelSpace")}m³`;
  }

  getBackgroundImage() {
    return "/img/system/fuelTank.png";
  }
}

export default FuelTank;
