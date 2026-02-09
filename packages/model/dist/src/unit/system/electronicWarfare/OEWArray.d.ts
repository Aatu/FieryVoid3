import ShipSystem from "../ShipSystem";
import { EWArrayArgs } from "./EwArray";
declare class OEWArray extends ShipSystem {
    constructor(args: EWArrayArgs, output: number);
    getDisplayName(): string;
    getBackgroundImage(): string;
    getIconText(): string;
}
export default OEWArray;
