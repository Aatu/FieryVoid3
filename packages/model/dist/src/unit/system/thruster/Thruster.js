import ShipSystem, { ShipSystemType } from "../ShipSystem";
import RequiresPowerSystemStrategy from "../strategy/RequiresPowerSystemStrategy";
import ThrustChannelSystemStrategy from "../strategy/ThrustChannelSystemStrategy";
import { SYSTEM_HANDLERS } from "../strategy/types/SystemHandlersTypes";
import { ChemicalThrustChannelStrategy } from "../strategy/ChemicalThrustChannelStrategy";
class Thruster extends ShipSystem {
    constructor(args, output, direction, thrusterArgs) {
        const { power = 1, fuelPerThrust = 1, heatPerThrust = 1, } = thrusterArgs || {};
        super(args, [
            new ThrustChannelSystemStrategy(output, direction, [
                new ChemicalThrustChannelStrategy({
                    output,
                    fuelPerThrust,
                    heatPerThrust,
                }),
            ]),
            new RequiresPowerSystemStrategy(power),
        ]);
    }
    getSystemType() {
        return this.handlers.getShipSystemType(ShipSystemType.EXTERNAL);
    }
    getDisplayName() {
        return "Thruster";
    }
    getBackgroundImage() {
        return this.callHandler(SYSTEM_HANDLERS.getBackgroundImage, null, "");
    }
}
export default Thruster;
