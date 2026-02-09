import { DiceRoller } from "../../../utils/DiceRoller";
import Ship from "../../Ship";
import { IShipSystemStrategy } from "../../ShipSystemHandlers";
import ShipSystems from "../../ShipSystems";
import ShipSystem from "../ShipSystem";
import { SYSTEM_HANDLERS } from "./types/SystemHandlersTypes";
declare class ShipSystemStrategy implements IShipSystemStrategy {
    protected system: ShipSystem | null;
    protected diceRoller: DiceRoller;
    constructor();
    init(system: ShipSystem): void;
    getSystem(): ShipSystem;
    getShip(): Ship;
    getShipSystems(): ShipSystems;
    getSystems(): ShipSystem[];
    getSystemById(id: number): ShipSystem;
    callHandler: <T>(name: SYSTEM_HANDLERS, payload: unknown | undefined, previousResponse: T) => T;
}
export default ShipSystemStrategy;
