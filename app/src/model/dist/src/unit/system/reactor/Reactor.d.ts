import ShipSystem, { SystemArgs } from "../ShipSystem";
declare class Reactor extends ShipSystem {
    constructor(args: SystemArgs, output: number);
    getDisplayName(): string;
    getBackgroundImage(): string;
    getIconText(): string;
}
export default Reactor;
