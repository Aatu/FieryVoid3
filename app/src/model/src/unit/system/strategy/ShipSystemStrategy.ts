import { DiceRoller } from "../../../utils/DiceRoller";
import Ship from "../../Ship";
import ShipSystems from "../../ShipSystems";
import ShipSystem from "../ShipSystem";
import { SYSTEM_HANDLERS } from "./types/SystemHandlersTypes";

class ShipSystemStrategy {
  protected system: ShipSystem | null = null;
  protected diceRoller: DiceRoller;

  constructor() {
    this.system = null;
    this.diceRoller = new DiceRoller();
  }

  public init(system: ShipSystem) {
    this.system = system;
  }

  protected getSystem() {
    if (!this.system) {
      throw new Error("System not initialized");
    }
    return this.system;
  }

  protected getShip(): Ship {
    return this.getSystem().getShipSystems().ship;
  }

  protected getShipSystems(): ShipSystems {
    return this.getSystem().getShipSystems();
  }

  protected getSystems(): ShipSystem[] {
    return this.getShipSystems().getSystems();
  }

  protected getSystemById(id: number): ShipSystem {
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
