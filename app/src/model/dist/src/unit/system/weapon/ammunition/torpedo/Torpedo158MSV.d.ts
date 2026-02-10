import Ship from "../../../../Ship";
import TorpedoFlight from "../../../../TorpedoFlight";
import Torpedo158 from "./Torpedo158";
declare class Torpedo158MSV extends Torpedo158 {
    constructor();
    getStrikeDistance(flight: TorpedoFlight, target: Ship): number;
    getCargoInfo(): import("../../../strategy/types/SystemHandlersTypes").SystemMessage[];
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default Torpedo158MSV;
