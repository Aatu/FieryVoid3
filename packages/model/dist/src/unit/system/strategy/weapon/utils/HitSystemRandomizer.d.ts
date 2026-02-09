import ShipSystem from "../../../ShipSystem";
declare class HitSystemRandomizer {
    private rollForSystem;
    randomizeHitSystem(systems: ShipSystem[]): ShipSystem | null | undefined;
    private getSystemHitSize;
}
export default HitSystemRandomizer;
