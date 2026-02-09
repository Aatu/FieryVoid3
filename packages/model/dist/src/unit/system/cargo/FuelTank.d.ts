import ShipSystem, { SystemArgs } from "../ShipSystem";
declare class FuelTank extends ShipSystem {
    constructor(args: SystemArgs, space: number);
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default FuelTank;
