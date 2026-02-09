import ShipSystemStrategy from "./ShipSystemStrategy";
import { SystemMessage } from "./types/SystemHandlersTypes";
declare class RadiateHeatStrategy extends ShipSystemStrategy {
    private radiationCapacity;
    private heatRadiated;
    constructor(radiationCapacity: number);
    isRadiator(): boolean;
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    getRadiatedHeat(payload: unknown, previousResponse?: number): number;
    getHeatRadiationCapacity(payload: unknown, previousResponse?: number): number;
    radiateHeat(heat: number, previousResponse?: number): number;
}
export default RadiateHeatStrategy;
