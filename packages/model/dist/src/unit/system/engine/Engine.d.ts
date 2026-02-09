import ShipSystem, { SystemArgs } from "../ShipSystem";
declare class Engine extends ShipSystem {
    constructor(args: SystemArgs, output: number, power: number, boostPower: number);
    getDisplayName(): string;
    getBackgroundImage(): string;
    getIconText(): string;
}
export default Engine;
