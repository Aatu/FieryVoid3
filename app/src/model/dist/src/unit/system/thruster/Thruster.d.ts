import ShipSystem, { ShipSystemType, SystemArgs } from "../ShipSystem";
import { THRUSTER_DIRECTION } from "../strategy/ThrustChannelSystemStrategy";
export type ThrusterArgs = {
    power?: number;
    fuelPerThrust?: number;
    heatPerThrust?: number;
};
declare class Thruster extends ShipSystem {
    constructor(args: SystemArgs, output: number, direction: THRUSTER_DIRECTION | THRUSTER_DIRECTION[], thrusterArgs?: ThrusterArgs);
    getSystemType(): ShipSystemType;
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default Thruster;
