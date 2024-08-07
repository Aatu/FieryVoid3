import ShipSystem, { SystemArgs } from "../ShipSystem";
import ThrustChannelSystemStrategy, {
  THRUSTER_DIRECTION,
  THRUSTER_MODE,
} from "../strategy/ThrustChannelSystemStrategy";
import { SYSTEM_HANDLERS } from "../strategy/types/SystemHandlersTypes";

class ChemicalThruster extends ShipSystem {
  constructor(args: SystemArgs, output: number, direction: THRUSTER_DIRECTION) {
    super(args, [
      new ThrustChannelSystemStrategy(
        output,
        direction,
        {},
        THRUSTER_MODE.CHEMICAL
      ),
    ]);
  }

  getDisplayName() {
    return "Chemical Thruster";
  }

  getBackgroundImage() {
    return this.callHandler(SYSTEM_HANDLERS.getBackgroundImage, undefined, "");
  }
}

export default ChemicalThruster;
