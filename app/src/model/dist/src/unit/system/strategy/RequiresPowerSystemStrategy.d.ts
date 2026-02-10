import ShipSystemStrategy from "./ShipSystemStrategy";
import { ForcedOffline } from "../criticals/index";
import { SystemMessage } from "./types/SystemHandlersTypes";
import { IShipSystemStrategy, SystemTooltipMenuButton } from "../../ShipSystemHandlers";
declare class RequiresPowerSystemStrategy extends ShipSystemStrategy implements IShipSystemStrategy {
    private power;
    private getsCriticals;
    constructor(power: number, getsCriticals?: boolean);
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    getPowerRequirement(payload: unknown, previousResponse?: number): number;
    canSetOffline(payload: unknown, previousResponse?: boolean): boolean;
    canSetOnline(): boolean;
    shouldBeOffline(payload: unknown, previousResponse?: boolean): boolean;
    getTooltipMenuButton(payload?: {
        myShip?: boolean;
    }, previousResponse?: never[]): SystemTooltipMenuButton[];
    getPossibleCriticals(payload: unknown, previousResponse?: never[]): {
        severity: number;
        critical: ForcedOffline;
    }[];
}
export default RequiresPowerSystemStrategy;
