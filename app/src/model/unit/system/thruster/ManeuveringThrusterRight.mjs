import ShipSystem from "../ShipSystem.mjs";
import {
  ThrustChannelSystemStrategy,
  AllowsEvasionSystemStrategy
} from "../strategy/index.mjs";

class ManeuveringThrusterRight extends ShipSystem {
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
    return "/img/system/maneuveringThrusterRight.png";
  }

  getIconText() {
    return this.callHandler("getThrustChannel");
  }
}

export default ManeuveringThrusterRight;