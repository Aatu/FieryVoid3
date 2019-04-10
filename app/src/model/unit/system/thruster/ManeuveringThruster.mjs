import ShipSystem from "../ShipSystem.mjs";
import {
  ThrustChannelSystemStrategy,
  AllowsEvasionSystemStrategy
} from "../strategy";

class ManeuveringThruster extends ShipSystem {
  constructor(args, channel, evasion) {
    super(args);
    this.strategies = [
      new ThrustChannelSystemStrategy(channel, 6),
      new AllowsEvasionSystemStrategy(evasion)
    ];
  }
}

export default ManeuveringThruster;
