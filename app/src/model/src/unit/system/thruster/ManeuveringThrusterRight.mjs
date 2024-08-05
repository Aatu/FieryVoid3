import ShipSystem from "../ShipSystem.mjs";
import {
  AllowsEvasionSystemStrategy,
  ThrustChannelSystemStrategy,
} from "../strategy/index.mjs";
import { THRUSTER_MODE_MANEUVER } from "../strategy/ThrustChannelSystemStrategy.mjs";

class ManeuveringThrusterRight extends ShipSystem {
  constructor(args, channel, evasion) {
    super(args, [
      new ThrustChannelSystemStrategy(
        channel,
        [7, 8],
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
    return "/img/system/maneuveringThrusterRight.png";
  }
}

export default ManeuveringThrusterRight;
