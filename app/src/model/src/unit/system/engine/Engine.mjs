import ShipSystem from "../ShipSystem.mjs";
import {
  BoostableSystemStrategy,
  ThrustOutputSystemStrategy,
  RequiresPowerSystemStrategy
} from "../strategy/index.mjs";

class Engine extends ShipSystem {
  constructor(args, output, power, boostPower) {
    super(args, [
      new BoostableSystemStrategy(boostPower),
      new ThrustOutputSystemStrategy(output),
      new RequiresPowerSystemStrategy(power)
    ]);
  }

  getDisplayName() {
    return "Engine";
  }

  getBackgroundImage() {
    return "/img/system/engine.png";
  }

  getIconText() {
    return this.callHandler("getThrustOutput");
  }
}

export default Engine;
