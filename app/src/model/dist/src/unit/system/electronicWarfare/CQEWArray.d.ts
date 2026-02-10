import ShipSystem, { SystemArgs } from "../ShipSystem";
declare class CQEWArray extends ShipSystem {
    constructor(args: SystemArgs, output: number);
    getDisplayName(): string;
    getBackgroundImage(): string;
    getIconText(): string;
}
export default CQEWArray;
