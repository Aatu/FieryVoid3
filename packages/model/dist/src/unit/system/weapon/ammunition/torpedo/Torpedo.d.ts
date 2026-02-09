import CargoEntity from "../../../../../cargo/CargoEntity";
import Ship from "../../../../Ship";
import TorpedoFlight from "../../../../TorpedoFlight";
import { SystemMessage } from "../../../strategy/types/SystemHandlersTypes";
import TorpedoDamageStrategy from "./torpedoDamageStrategy/TorpedoDamageStrategy";
type TorpedoVisuals = {
    engineColor: [number, number, number];
    explosionType: string;
    explosionSize: number;
};
declare class Torpedo extends CargoEntity {
    minRange: number;
    maxRange: number;
    hitSize: number;
    evasion: number;
    damageStrategy: TorpedoDamageStrategy | null;
    visuals: TorpedoVisuals;
    constructor({ minRange, maxRange, hitSize, evasion }: {
        minRange?: number | undefined;
        maxRange?: number | undefined;
        hitSize?: number | undefined;
        evasion?: number | undefined;
    });
    getDamageStrategy(): TorpedoDamageStrategy;
    getStrikeDistance(flight: TorpedoFlight, target: Ship): number;
    getHitSize(): number;
    getEvasion(): number;
    getCargoInfo(): SystemMessage[];
}
export default Torpedo;
