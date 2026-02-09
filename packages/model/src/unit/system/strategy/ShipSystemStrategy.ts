import { DiceRoller } from "../../../utils/DiceRoller";
import Ship from "../../Ship";
import { IShipSystemStrategy } from "../../ShipSystemHandlers";
import ShipSystems from "../../ShipSystems";
import ShipSystem from "../ShipSystem";
import { SYSTEM_HANDLERS } from "./types/SystemHandlersTypes";

class ShipSystemStrategy implements IShipSystemStrategy {
  protected system: ShipSystem | null = null;
  protected diceRoller: DiceRoller;

  constructor() {
    this.system = null;
    this.diceRoller = new DiceRoller();
  }

  public init(system: ShipSystem) {
    this.system = system;
  }

  public getSystem() {
    if (!this.system) {
      throw new Error("System not initialized");
    }
    return this.system;
  }

  public getShip(): Ship {
    return this.getSystem().getShipSystems().ship;
  }

  public getShipSystems(): ShipSystems {
    return this.getSystem().getShipSystems();
  }

  public getSystems(): ShipSystem[] {
    return this.getShipSystems().getSystems();
  }

  public getSystemById(id: number): ShipSystem {
    return this.getShipSystems().getSystemById(id);
  }

  public callHandler = <T>(
    name: SYSTEM_HANDLERS,
    payload: unknown = {},
    previousResponse: T
  ): T => {
    // @ts-expect-error I dont know how to type this
    if (!this[name]) {
      return previousResponse;
    }

    // @ts-expect-error I dont know how to type this
    return this[name](payload, previousResponse);
  };
}

export default ShipSystemStrategy;
