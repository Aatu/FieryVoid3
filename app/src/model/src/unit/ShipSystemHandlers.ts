import ShipSystem from "./system/ShipSystem";

interface IBaseShipSystemStrategy {
  init: (system: ShipSystem) => void;
}

export type SystemTooltipMenuButton = {
  sort: number;
  img: string;
  clickHandler: () => void;
  disabledHandler?: () => boolean;
};

export interface IShipSystemHandlers {
  isBoostable: (payload?: unknown, previousResponse?: boolean) => boolean;
  canBoost: (payload?: unknown, previousResponse?: boolean) => boolean;
  canDeBoost: (payload: unknown, previousResponse: unknown) => boolean;
  getBoost: (payload: unknown, previousResponse: number | undefined) => number;
  boost: (payload: unknown, previousResponse: unknown) => void;
  deBoost: (payload: unknown, previousResponse: unknown) => void;
  getTooltipMenuButton: (payload: {
    myShip: boolean;
  }) => SystemTooltipMenuButton[];
}

export type IShipSystemStrategy = IBaseShipSystemStrategy &
  Partial<IShipSystemHandlers>;

export type HandlerType = keyof IShipSystemStrategy;

export class SystemHandlers {
  private system: ShipSystem;

  constructor(system: ShipSystem) {
    this.system = system;
  }

  getTooltipMenuButton(payload: {
    myShip: boolean;
  }): SystemTooltipMenuButton[] {
    return this.callHandler(
      "getTooltipMenuButton",
      [] as SystemTooltipMenuButton[],
      payload
    );
  }

  isBoostable(): boolean {
    return Boolean(this.callHandler<boolean>("isBoostable"));
  }

  canBoost(): boolean {
    return Boolean(this.callHandler<boolean>("canBoost"));
  }

  canDeBoost(): boolean {
    return Boolean(this.callHandler<boolean>("canDeBoost"));
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
    response?: T,
    payload?: unknown
  ): T {
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
