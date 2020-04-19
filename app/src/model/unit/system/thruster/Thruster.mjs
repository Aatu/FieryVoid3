import ShipSystem from "../ShipSystem.mjs";
import { ThrustChannelSystemStrategy } from "../strategy/index.mjs";
import RequiresPowerSystemStrategy from "../strategy/RequiresPowerSystemStrategy.mjs";
import BoostableSystemStrategy from "../strategy/BoostableSystemStrategy.mjs";

class Thruster extends ShipSystem {
  constructor(
    args,
    output,
    direction,
    { power = 1, boostPower = 1, maxBoost = 0, thrustExtra } = {}
  ) {
    super(args, [
      new ThrustChannelSystemStrategy(output, direction, { thrustExtra }),
      new RequiresPowerSystemStrategy(power),
      new BoostableSystemStrategy(boostPower, maxBoost),
    ]);
  }

  getDisplayName() {
    return "C/Fusion Thruster";
  }

  getBackgroundImage() {
    if (this.callHandler("isDirection", 3, false)) {
      return "/img/system/thruster2.png";
    } else if (this.callHandler("isDirection", 2, false)) {
      return "/img/system/thruster4.png";
    } else if (this.callHandler("isDirection", 5, false)) {
      return "/img/system/thruster3.png";
    }
    return "/img/system/thruster1.png";
  }
}

export default Thruster;
