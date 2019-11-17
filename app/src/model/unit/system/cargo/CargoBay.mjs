import ShipSystem from "../ShipSystem.mjs";
import { CargoBaySystemStrategy } from "../strategy/index.mjs";

class CargoBay extends ShipSystem {
  constructor(args, space) {
    super(args, [new CargoBaySystemStrategy(space)]);
  }

  getDisplayName() {
    return `Cargo bay ${this.callHandler("getTotalCargoSpace")}m³`;
  }

  getBackgroundImage() {
    return "/img/system/cargoBay.png";
  }
}

export default CargoBay;
