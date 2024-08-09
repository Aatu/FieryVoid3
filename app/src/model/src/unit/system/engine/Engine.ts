import ShipSystem, { SystemArgs } from "../ShipSystem";
import {
  BoostableSystemStrategy,
  ThrustOutputSystemStrategy,
  RequiresPowerSystemStrategy,
} from "../strategy/index";
import { SYSTEM_HANDLERS } from "../strategy/types/SystemHandlersTypes";

class Engine extends ShipSystem {
  constructor(
    args: SystemArgs,
    output: number,
    power: number,
    boostPower: number
  ) {
    super(args, [
      new BoostableSystemStrategy(boostPower),
      new ThrustOutputSystemStrategy(output),
      new RequiresPowerSystemStrategy(power),
    ]);
  }

  getDisplayName() {
    return "Engine";
  }

  getBackgroundImage() {
    return "/img/system/engine.png";
  }

  getIconText() {
    return this.callHandler(SYSTEM_HANDLERS.getThrustOutput, undefined, "");
  }
}

export default Engine;
