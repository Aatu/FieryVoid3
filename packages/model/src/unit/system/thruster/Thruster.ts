import ShipSystem, { ShipSystemType, SystemArgs } from "../ShipSystem";
import RequiresPowerSystemStrategy from "../strategy/RequiresPowerSystemStrategy";
import ThrustChannelSystemStrategy, {
  THRUSTER_DIRECTION,
} from "../strategy/ThrustChannelSystemStrategy";
import { SYSTEM_HANDLERS } from "../strategy/types/SystemHandlersTypes";
import { ChemicalThrustChannelStrategy } from "../strategy/ChemicalThrustChannelStrategy";

export type ThrusterArgs = {
  power?: number;
  fuelPerThrust?: number;
  heatPerThrust?: number;
};

class Thruster extends ShipSystem {
  constructor(
    args: SystemArgs,
    output: number,
    direction: THRUSTER_DIRECTION | THRUSTER_DIRECTION[],
    thrusterArgs?: ThrusterArgs
  ) {
    const {
      power = 1,
      fuelPerThrust = 1,
      heatPerThrust = 1,
    } = thrusterArgs || {};

    super(args, [
      new ThrustChannelSystemStrategy(output, direction, [
        new ChemicalThrustChannelStrategy({
          output,
          fuelPerThrust,
          heatPerThrust,
        }),
      ]),
      new RequiresPowerSystemStrategy(power),
    ]);
  }

  getSystemType(): ShipSystemType {
    return this.handlers.getShipSystemType(ShipSystemType.EXTERNAL);
  }

  getDisplayName() {
    return "Thruster";
  }

  getBackgroundImage() {
    return this.callHandler(SYSTEM_HANDLERS.getBackgroundImage, null, "");
  }
}

export default Thruster;
