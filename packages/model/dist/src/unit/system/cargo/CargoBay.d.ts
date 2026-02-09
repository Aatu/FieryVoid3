import ShipSystem, { SystemArgs } from "../ShipSystem";
declare class CargoBay extends ShipSystem {
    constructor(args: SystemArgs, space: number);
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default CargoBay;
