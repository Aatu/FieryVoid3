import ShipSystem, { SystemArgs } from "../ShipSystem";
declare class ManeuveringThruster extends ShipSystem {
    constructor(args: SystemArgs, channel: number, evasion: number);
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default ManeuveringThruster;
