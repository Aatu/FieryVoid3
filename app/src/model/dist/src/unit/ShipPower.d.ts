import Ship from "./Ship";
import ShipSystems from "./ShipSystems";
import ShipSystem from "./system/ShipSystem";
declare class ShipPower {
    private shipSystems;
    constructor(shipSystems: ShipSystems);
    getPowerOutput(): number;
    getPowerRequired(): number;
    getRemainingPowerOutput(): number;
    isValidPower(): boolean;
    canSetOffline(system: ShipSystem): false;
    canSetOnline(system: ShipSystem): boolean;
    copyPower(ship: Ship): void;
    forceValidPower(): void;
    advanceTurn(turn: number): void;
}
export default ShipPower;
