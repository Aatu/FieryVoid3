import ShipSystem from "./system/ShipSystem";

interface IBaseShipSystemStrategy {
  init: (system: ShipSystem) => void;
}

export interface IShipSystemHandlers {
  isBoostable: (payload?: unknown, previousResponse?: boolean) => boolean;
  canBoost: (payload?: unknown, previousResponse?: boolean) => boolean;
  canDeBoost: (payload: unknown, previousResponse: unknown) => boolean;
  getBoost: (payload: unknown, previousResponse: number | undefined) => number;
  boost: (payload: unknown, previousResponse: unknown) => void;
  deBoost: (payload: unknown, previousResponse: unknown) => void;
}

export type IShipSystemStrategy = IBaseShipSystemStrategy &
  Partial<IShipSystemHandlers>;

export type HandlerType = keyof IShipSystemStrategy;

export class SystemHandlers {
  private system: ShipSystem;

  constructor(system: ShipSystem) {
    this.system = system;
  }

  isBoostable(): boolean {
    return Boolean(this.callHandler("isBoostable"));
  }

  canBoost(): boolean {
    return Boolean(this.callHandler("canBoost"));
  }

  canDeBoost(): boolean {
    return Boolean(this.callHandler("canDeBoost"));
  }

  getBoost(): number {
    return this.callHandler("getBoost") || 0;
  }

  boost(): void {
    this.callHandler("boost");
  }

  deBoost(): void {
    this.callHandler("deBoost");
  }

  private callHandler<T = unknown>(
    functionName: HandlerType,
    response?: unknown,
    payload?: unknown
  ): T | undefined {
    this.system.strategies.forEach((strategy) => {
      if (
        // @ts-expect-error I dont know how to type this
        typeof strategy[functionName] === "function"
      ) {
        // @ts-expect-error I dont know how to type this
        response = strategy[functionName](payload, response);
      }
    });

    return response as T;
  }
}
