import Torpedo72 from "./Torpedo72";
import TorpedoFlight from "../../../../TorpedoFlight";
import Ship from "../../../../Ship";
declare class Torpedo72MSV extends Torpedo72 {
    constructor();
    getStrikeDistance(flight: TorpedoFlight, target: Ship): number;
    getCargoInfo(): import("../../../strategy/types/SystemHandlersTypes").SystemMessage[];
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default Torpedo72MSV;
