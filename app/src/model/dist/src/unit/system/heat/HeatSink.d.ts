import ShipSystem, { SystemArgs } from "../ShipSystem";
declare class HeatSink extends ShipSystem {
    constructor(args: SystemArgs, heatStorage: number);
    getDisplayName(): string;
    getBackgroundImage(): string;
    getIconText(): string;
}
export default HeatSink;
