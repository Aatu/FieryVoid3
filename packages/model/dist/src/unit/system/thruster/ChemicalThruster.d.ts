import ShipSystem, { SystemArgs } from "../ShipSystem";
import { THRUSTER_DIRECTION } from "../strategy/ThrustChannelSystemStrategy";
declare class ChemicalThruster extends ShipSystem {
    constructor(args: SystemArgs, output: number, direction: THRUSTER_DIRECTION | THRUSTER_DIRECTION[]);
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default ChemicalThruster;
