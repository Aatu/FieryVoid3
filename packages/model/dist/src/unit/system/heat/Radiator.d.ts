import ShipSystem, { SystemArgs } from "../ShipSystem";
declare class Radiator extends ShipSystem {
    constructor(args: SystemArgs, radiationCapacity?: number, extraProfile?: number, armorBoost?: number);
    getDisplayName(): string;
    getBackgroundImage(): string;
    getIconText(): string;
}
export default Radiator;
