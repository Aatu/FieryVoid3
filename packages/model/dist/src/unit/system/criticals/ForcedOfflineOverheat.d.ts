import ShipSystem from "../ShipSystem";
import Critical from "./Critical";
declare class ForcedOfflineOverheat extends Critical {
    getMessage(): string;
    excludes(critical: Critical): critical is ForcedOfflineOverheat;
    isFixed(system: ShipSystem): boolean;
}
export default ForcedOfflineOverheat;
