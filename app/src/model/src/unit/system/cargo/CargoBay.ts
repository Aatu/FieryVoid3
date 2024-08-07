import ShipSystem, { SystemArgs } from "../ShipSystem";
import CargoBaySystemStrategy from "../strategy/CargoBaySystemStrategy";
import { SYSTEM_HANDLERS } from "../strategy/types/SystemHandlersTypes";

class CargoBay extends ShipSystem {
  constructor(args: SystemArgs, space: number) {
    super(args, [new CargoBaySystemStrategy(space)]);
  }

  getDisplayName() {
    return `Cargo bay ${this.callHandler(
      SYSTEM_HANDLERS.getTotalCargoSpace,
      undefined,
      0
    )}m³`;
  }

  getBackgroundImage() {
    return "/img/system/cargoBay.png";
  }
}

export default CargoBay;
