import ShipSystem from "../ShipSystem.mjs";
import { ThrustChannelSystemStrategy } from "../strategy";

class Thruster extends ShipSystem {
  constructor(args, channel, direction) {
    super(args);
    this.strategies = [new ThrustChannelSystemStrategy(channel, direction)];
  }
}

export default Thruster;
