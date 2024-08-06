import ShipSystem from "../ShipSystem.mjs";
import {
  AllowsEvasionSystemStrategy,
  ThrustChannelSystemStrategy,
} from "../strategy/index.mjs";
import { THRUSTER_MODE_MANEUVER } from "../strategy/ThrustChannelSystemStrategy.js";

class ManeuveringThrusterLeft extends ShipSystem {
  constructor(args, channel, evasion) {
    super(args, [
      new ThrustChannelSystemStrategy(
        channel,
        [6, 8],
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
    return "/img/system/maneuveringThrusterLeft.png";
  }
}

export default ManeuveringThrusterLeft;
