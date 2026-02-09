import Structure from "../structure/Structure";
import { SYSTEM_LOCATION } from "./systemLocation";
import ShipSystem from "../ShipSystem";
import Offset from "../../../hexagon/Offset";
declare class SystemSection {
    private location;
    private systems;
    constructor(location: SYSTEM_LOCATION);
    getLocation(): SYSTEM_LOCATION;
    getOffsetHex(): Offset;
    hasUndestroyedStructure(): boolean;
    addSystem(system: ShipSystem): this;
    getSystems(): ShipSystem[];
    isLocation(location: SYSTEM_LOCATION): boolean;
    hasSystems(): boolean;
    getStructure(): Structure | undefined;
    getNonStructureSystems(): ShipSystem[];
}
export default SystemSection;
