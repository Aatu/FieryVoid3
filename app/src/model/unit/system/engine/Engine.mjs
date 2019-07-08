import ShipSystem from "../ShipSystem.mjs";
import {
  BoostableSystemStrategy,
  ThrustOutputSystemStrategy,
  RequiresPowerSystemStrategy
} from "../strategy";

class Engine extends ShipSystem {
  constructor(args, output, power, boostPower) {
    super(args, [
      new BoostableSystemStrategy(boostPower),
      new ThrustOutputSystemStrategy(output),
      new RequiresPowerSystemStrategy(power)
    ]);
  }
}

export default Engine;
