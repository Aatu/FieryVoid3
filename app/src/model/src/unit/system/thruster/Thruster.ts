import ShipSystem, { SystemArgs } from "../ShipSystem";
import RequiresPowerSystemStrategy from "../strategy/RequiresPowerSystemStrategy";
import BoostableSystemStrategy from "../strategy/BoostableSystemStrategy";
import ThrustChannelSystemStrategy, {
  THRUSTER_DIRECTION,
  THRUSTER_MODE,
} from "../strategy/ThrustChannelSystemStrategy";

export type ThrusterArgs = {
  power?: number;
  boostPower?: number;
  maxBoost?: number | null;
  thrustHeatExtra?: number;
};

class Thruster extends ShipSystem {
  constructor(
    args: SystemArgs,
    output: number,
    direction: THRUSTER_DIRECTION | THRUSTER_DIRECTION[],
    {
      power = 1,
      boostPower = 1,
      maxBoost = null,
      thrustHeatExtra = 0,
    }: ThrusterArgs = {}
  ) {
    super(args, [
      new ThrustChannelSystemStrategy(
        output,
        direction,
        {
          thrustHeatExtra,
        },
        THRUSTER_MODE.FUSION,
        [THRUSTER_MODE.CHEMICAL]
      ),
      new RequiresPowerSystemStrategy(power),
    ]);

    if (maxBoost !== 0 && boostPower !== 0) {
      if (maxBoost === null) {
        maxBoost = Math.round(output / 2);
      }

      this.addStrategy(new BoostableSystemStrategy(boostPower, maxBoost || 0));
    }
  }

  getDisplayName() {
    return "C/Fusion Hybrid Thruster";
  }

  getBackgroundImage() {
    return this.callHandler("getBackgroundImage");
  }
}

export default Thruster;
