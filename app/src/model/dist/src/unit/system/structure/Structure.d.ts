import ShipSystem, { ShipSystemType, SystemArgs } from "../ShipSystem";
type StructureArgs = SystemArgs & {
    cargoSpace?: number;
    heatStorage?: number;
    radiator?: number;
    fuel?: number;
};
declare class Structure extends ShipSystem {
    constructor({ cargoSpace, heatStorage, radiator, fuel, ...args }: StructureArgs);
    getDisplayName(): string;
    getSystemType(): ShipSystemType;
}
export default Structure;
