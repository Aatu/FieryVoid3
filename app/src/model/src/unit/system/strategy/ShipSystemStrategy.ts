import { DiceRoller } from "../../../utils/DiceRoller";
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
