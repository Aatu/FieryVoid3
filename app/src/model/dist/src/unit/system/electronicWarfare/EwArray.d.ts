import { EW_TYPE } from "../../../electronicWarfare/electronicWarfareTypes";
import ShipSystem, { SystemArgs } from "../ShipSystem";
export type EWArrayArgs = SystemArgs & {
    heat?: number;
    boostHeat?: number;
    boostable?: boolean;
    power?: number;
    overheatTransferRatio?: number;
    boostPower?: number;
};
declare class EwArray extends ShipSystem {
    constructor(args: EWArrayArgs, output: number, ewTypes?: EW_TYPE[]);
    getDisplayName(): string;
    getBackgroundImage(): string;
    getIconText(): string;
}
export default EwArray;
