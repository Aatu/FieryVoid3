import ShipSystem, { SystemArgs } from "../ShipSystem";
declare class ManeuveringThrusterRight extends ShipSystem {
    constructor(args: SystemArgs, channel: number, evasion: number);
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default ManeuveringThrusterRight;
