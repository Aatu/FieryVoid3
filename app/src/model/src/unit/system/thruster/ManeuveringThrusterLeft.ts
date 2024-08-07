import ShipSystem, { SystemArgs } from "../ShipSystem";
import AllowsEvasionSystemStrategy from "../strategy/AllowsEvasionSystemStrategy";
import ThrustChannelSystemStrategy, {
  THRUSTER_DIRECTION,
  THRUSTER_MODE,
} from "../strategy/ThrustChannelSystemStrategy";
class ManeuveringThrusterLeft extends ShipSystem {
  constructor(args: SystemArgs, channel: number, evasion: number) {
    super(args, [
      new ThrustChannelSystemStrategy(
        channel,
        [THRUSTER_DIRECTION.PIVOT_RIGHT, THRUSTER_DIRECTION.MANOUVER],
        {},
        THRUSTER_MODE.MANEUVER
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
