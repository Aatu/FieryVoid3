import ShipSystem, { SystemArgs } from "../ShipSystem";
declare class ManeuveringThrusterLeft extends ShipSystem {
    constructor(args: SystemArgs, channel: number, evasion: number);
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default ManeuveringThrusterLeft;
