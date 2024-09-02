import ShipSystem, { SystemArgs } from "../ShipSystem";
import AllowsEvasionSystemStrategy from "../strategy/AllowsEvasionSystemStrategy";
import { ChemicalThrustChannelStrategy } from "../strategy/ChemicalThrustChannelStrategy";
import ThrustChannelSystemStrategy, {
  THRUSTER_DIRECTION,
} from "../strategy/ThrustChannelSystemStrategy";
class ManeuveringThrusterLeft extends ShipSystem {
  constructor(args: SystemArgs, channel: number, evasion: number) {
    super(args, [
      new ThrustChannelSystemStrategy(
        channel,
        [THRUSTER_DIRECTION.PIVOT_RIGHT, THRUSTER_DIRECTION.MANOUVER],
        [
          new ChemicalThrustChannelStrategy({
            output: channel,
            fuelPerThrust: 1,
            heatPerThrust: 1,
          }),
        ]
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
