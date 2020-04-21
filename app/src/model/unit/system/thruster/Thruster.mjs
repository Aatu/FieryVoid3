import ShipSystem from "../ShipSystem.mjs";
import { ThrustChannelSystemStrategy } from "../strategy/index.mjs";
import RequiresPowerSystemStrategy from "../strategy/RequiresPowerSystemStrategy.mjs";
import BoostableSystemStrategy from "../strategy/BoostableSystemStrategy.mjs";
import { THRUSTER_MODE_FUSION } from "../strategy/ThrustChannelSystemStrategy.mjs";
import { THRUSTER_MODE_CHEMICAL } from "../strategy/ThrustChannelSystemStrategy.mjs";

class Thruster extends ShipSystem {
  constructor(
    args,
    output,
    direction,
    { power = 1, boostPower = 1, maxBoost = null, thrustHeatExtra } = {}
  ) {
    super(args, [
      new ThrustChannelSystemStrategy(
        output,
        direction,
        {
          thrustHeatExtra,
        },
        THRUSTER_MODE_FUSION,
        [THRUSTER_MODE_CHEMICAL]
      ),
      new RequiresPowerSystemStrategy(power),
    ]);

    if (maxBoost !== 0 && boostPower !== 0) {
      if (maxBoost === null) {
        maxBoost = Math.round(output / 2);
      }

      this.addStrategy(new BoostableSystemStrategy(boostPower, maxBoost));
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
