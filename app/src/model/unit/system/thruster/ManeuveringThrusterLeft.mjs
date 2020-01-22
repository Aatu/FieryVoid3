import ShipSystem from "../ShipSystem.mjs";
import {
  ThrustChannelSystemStrategy,
  AllowsEvasionSystemStrategy
} from "../strategy/index.mjs";

class ManeuveringThrusterLeft extends ShipSystem {
  constructor(args, channel, evasion) {
    super(args, [
      new ThrustChannelSystemStrategy(channel, [7, 8]),
      new AllowsEvasionSystemStrategy(evasion)
    ]);
  }

  getDisplayName() {
    return "Maneuvering Thruster";
  }

  getBackgroundImage() {
    return "/img/system/maneuveringThruster.png";
  }

  getIconText() {
    return this.callHandler("getThrustChannel");
  }
}

export default ManeuveringThrusterLeft;
