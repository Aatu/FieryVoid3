import ShipSystem from "../ShipSystem.mjs";
import {
  AllowsEvasionSystemStrategy,
  ThrustChannelSystemStrategy,
} from "../strategy/index.mjs";
import { THRUSTER_MODE_MANEUVER } from "../strategy/ThrustChannelSystemStrategy.js";

class ManeuveringThruster extends ShipSystem {
  constructor(args, channel, evasion) {
    super(args, [
      new ThrustChannelSystemStrategy(
        channel,
        [6, 7, 8],
        {},
        THRUSTER_MODE_MANEUVER
      ),
      new AllowsEvasionSystemStrategy(evasion),
    ]);
  }

  getDisplayName() {
    return "Maneuvering Thruster";
  }

  getBackgroundImage() {
    return "/img/system/maneuveringThruster.png";
  }
}

export default ManeuveringThruster;
