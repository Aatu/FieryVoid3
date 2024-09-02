import ShipSystemStrategy from "./ShipSystemStrategy";
import ThrustChannelHeatIncreased from "../criticals/ThrustChannelHeatIncreased";
import { OutputReduced } from "../criticals/index";
import { SystemMessage } from "./types/SystemHandlersTypes";
import { SystemTooltipMenuButton } from "../../ShipSystemHandlers";
import { GAME_PHASE } from "../../../game/gamePhase";
import ShipSystem from "../ShipSystem";

export type SerializedThrustChannelSystemStrategy = {
  thrustChannelSystemStrategy: {
    channeled: number;
    currentMode: string;
    strategies: Record<string, unknown>[];
  };
};

export enum THRUSTER_DIRECTION {
  FORWARD = 0,
  AFT = 3,
  STARBOARD_FORWARD = 1,
  STARBOARD_AFT = 2,
  PORT_FORWARD = 4,
  PORT_AFT = 5,
  PIVOT_RIGHT = 6,
  PIVOT_LEFT = 7,
  MANOUVER = 8,
}
const directionsToString = {
  [THRUSTER_DIRECTION.FORWARD]: "Thrust forward",
  [THRUSTER_DIRECTION.AFT]: "Thrust aft",
  [THRUSTER_DIRECTION.STARBOARD_FORWARD]: "Thrust starboard",
  [THRUSTER_DIRECTION.STARBOARD_AFT]: "Thrust starboard",
  [THRUSTER_DIRECTION.PORT_FORWARD]: "Thrust port",
  [THRUSTER_DIRECTION.PORT_AFT]: "Thrust port",
  [THRUSTER_DIRECTION.PIVOT_RIGHT]: "Pivot right",
  [THRUSTER_DIRECTION.PIVOT_LEFT]: "Pivot left",
  [THRUSTER_DIRECTION.MANOUVER]: "Roll, Evade",
};

export enum THRUSTER_MODE {
  FUSION = "fusion",
  MANEUVER = "maneuver",
  CHEMICAL = "chemical",
}

export interface IThrustChannelStrategy {
  isBoostable: () => boolean;
  canBoost: () => boolean;
  getFuelRequirement: (amount: number, system: ShipSystem) => number;
  getHeatGenerated: (amount: number, system: ShipSystem) => number;
  getThrustOutput: (system: ShipSystem, boost: number) => number;
  getMessages: (system: ShipSystem) => SystemMessage[];
  getBackgroundImage: (system: ShipSystem) => string;
  advanceTurn(isActive: boolean): void;
  getStrategyName: () => string;
  deserialize: (data: Record<string, unknown>) => void;
  serialize: () => Record<string, unknown>;
  equals: (other: IThrustChannelStrategy) => boolean;
}

class ThrustChannelSystemStrategy extends ShipSystemStrategy {
  private direction: THRUSTER_DIRECTION | THRUSTER_DIRECTION[];
  private channeled: number;
  private strategies: IThrustChannelStrategy[] = [];
  private currentMode: IThrustChannelStrategy;
  private baseOutput: number;

  constructor(
    output: number,
    direction: THRUSTER_DIRECTION | THRUSTER_DIRECTION[],
    strategies: IThrustChannelStrategy[]
  ) {
    super();

    this.baseOutput = output;

    if (strategies.length === 0) {
      throw new Error("Thruster needs a thrust strategy");
    }

    this.strategies = strategies;
    this.currentMode = strategies[0];

    this.direction = direction || 0; // 0, 3, [4,5], [1,2], 6
    this.channeled = 0;
  }

  isBoostable(payload: unknown, previousResponse = true): boolean {
    if (previousResponse === false) {
      return false;
    }

    return this.currentMode.isBoostable();
  }

  canBoost(payload: unknown, previousResponse = true): boolean {
    if (previousResponse === false) {
      return false;
    }

    return this.currentMode.canBoost();
  }

  canChangeMode() {
    return this.strategies.length > 1;
  }

  changeMode() {
    if (!this.canChangeMode()) {
      throw new Error("Check validity first");
    }

    let index = this.strategies.indexOf(this.currentMode);

    if (index === this.strategies.length - 1) {
      index = 0;
    } else {
      index++;
    }

    this.currentMode = this.strategies[index];
    this.getSystem().handlers.resetBoost();
  }

  getFuelRequirement(amount: number | null = null): number {
    if (amount === null) {
      amount = this.channeled;
    }

    return this.currentMode.getFuelRequirement(amount, this.getSystem());
  }

  resetChanneledThrust() {
    this.channeled = 0;
  }

  addChanneledThrust(channel: number) {
    this.channeled += channel;
  }

  setChanneledThrust(channel: number) {
    this.channeled = channel;
  }

  getChanneledThrust() {
    return this.channeled;
  }

  getIconText() {
    return this.channeled;
  }

  serialize(
    payload: unknown,
    previousResponse = []
  ): SerializedThrustChannelSystemStrategy {
    return {
      ...previousResponse,
      thrustChannelSystemStrategy: {
        channeled: this.channeled,
        currentMode: this.currentMode.getStrategyName(),
        strategies: this.strategies.map((strategy) => strategy.serialize()),
      },
    };
  }

  deserialize(data: Partial<SerializedThrustChannelSystemStrategy> = {}) {
    this.channeled = data?.thrustChannelSystemStrategy?.channeled ?? 0;

    const currentModeName = data?.thrustChannelSystemStrategy?.currentMode;

    if (currentModeName) {
      const newMode = this.strategies.find(
        (s) => s.getStrategyName() === currentModeName
      );

      if (!newMode) {
        throw new Error(`Invalid thruster mode ${currentModeName}`);
      }

      this.currentMode = newMode;
    }

    data?.thrustChannelSystemStrategy?.strategies?.forEach(
      (strategyData, i) => {
        this.strategies[i].deserialize(strategyData);
      }
    );

    return this;
  }

  getDirectionString() {
    if (Array.isArray(this.direction)) {
      return this.direction
        .map((direction) => directionsToString[direction])
        .join(", ");
    }

    return directionsToString[this.direction];
  }

  getMessages(
    payload: unknown,
    previousResponse: SystemMessage[] = []
  ): SystemMessage[] {
    return [
      ...previousResponse,
      ...this.currentMode.getMessages(this.getSystem()),
      {
        header: "Output",
        value: this.getThrustOutput(undefined, 0).toString(),
      },
      {
        header: "Manouver(s)",
        value: this.getDirectionString(),
      },
      {
        header: "Channeled",
        value: this.channeled.toString(),
      },
      {
        header: "Fuel expended",
        value: this.getFuelRequirement().toString(),
      },
    ];
  }

  getBackgroundImage() {
    return this.currentMode.getBackgroundImage(this.getSystem());

    /*
    if (mode === THRUSTER_MODE.FUSION) {
      if (
        this.callHandler(
          SYSTEM_HANDLERS.isDirection,
          THRUSTER_DIRECTION.AFT,
          false
        )
      ) {
        return "/img/system/thruster2.png";
      } else if (
        this.callHandler(
          SYSTEM_HANDLERS.isDirection,
          THRUSTER_DIRECTION.STARBOARD_AFT,
          false
        )
      ) {
        return "/img/system/thruster4.png";
      } else if (
        this.callHandler(
          SYSTEM_HANDLERS.isDirection,
          THRUSTER_DIRECTION.PORT_AFT,
          false
        )
      ) {
        return "/img/system/thruster3.png";
      }
      return "/img/system/thruster1.png";
    }
      */
  }

  getTooltipMenuButton(
    payload?: { myShip?: boolean },
    previousResponse = []
  ): SystemTooltipMenuButton[] {
    if (!payload?.myShip) {
      return previousResponse;
    }

    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    if (!this.canChangeMode()) {
      return previousResponse;
    }

    return [
      ...previousResponse,
      {
        sort: 50,
        img: "/img/system/thrusterC1.png",
        clickHandler: this.changeMode.bind(this),
      },
    ];
  }

  generatesHeat() {
    return true;
  }

  getHeatGenerated(payload: unknown, previousResponse = 0) {
    return (
      previousResponse +
      this.currentMode.getHeatGenerated(this.channeled, this.getSystem())
    );
  }

  getThrustDirection(payload: unknown, previousResponse = null) {
    return this.direction;
  }

  getThrustOutput(payload: undefined, previousResponse = 0) {
    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    const boost = this.getSystem().handlers.getBoost();
    let output = this.currentMode.getThrustOutput(this.getSystem(), boost);

    const outputReduction = this.getSystem()
      .damage.getCriticals()
      .filter((critical) => critical instanceof OutputReduced)
      .reduce((total, current) => total + current.getOutputReduction(), 0);

    output = output - outputReduction;

    if (output < 0) {
      output = 0;
    }

    return previousResponse + output;
  }

  getMaxChannelAmount() {
    return this.getThrustOutput(undefined, 0);
  }

  canChannelAmount(amount: number) {
    return amount <= this.getMaxChannelAmount();
  }

  getChannelCost(amount: number) {
    return amount;
  }

  isThruster(payload: unknown, previousResponse = false): boolean {
    return true;
  }

  isThrustDirection(direction: THRUSTER_DIRECTION) {
    return (
      this.direction === direction ||
      (Array.isArray(this.direction) && this.direction.includes(direction))
    );
  }

  getRequiredPhasesForReceivingPlayerData(
    payload: unknown,
    previousResponse = GAME_PHASE.GAME
  ) {
    if (previousResponse > GAME_PHASE.GAME) {
      return previousResponse;
    }

    return GAME_PHASE.GAME;
  }

  receivePlayerData({
    clientSystem,
    phase,
  }: {
    clientSystem: any;
    phase: GAME_PHASE;
  }) {
    if (phase !== GAME_PHASE.GAME) {
      return;
    }

    if (!clientSystem) {
      return;
    }

    if (this.getSystem().isDisabled()) {
      return;
    }

    const clientStrategy = clientSystem.getStrategiesByInstance(
      ThrustChannelSystemStrategy
    )[0];

    const targetMode = clientStrategy.currentMode;

    if (targetMode.equals(this.currentMode)) {
      return;
    }

    const newMode = this.strategies.find((strategy) =>
      strategy.equals(targetMode)
    );

    if (!this.canChangeMode() || !newMode) {
      throw new Error(`This system can not change mode to ${targetMode}`);
    }

    this.currentMode = newMode;

    this.getSystem().handlers.resetBoost();
  }

  advanceTurn() {
    this.channeled = 0;
    this.strategies.forEach((strategy) => {
      const active = this.currentMode === strategy;

      strategy.advanceTurn(active);
    });
  }

  getPossibleCriticals(payload: unknown, previousResponse = []) {
    return [
      ...previousResponse,

      { severity: 20, critical: new ThrustChannelHeatIncreased(0.5, 1) },
      {
        severity: 30,
        critical: new OutputReduced(0.25, 2),
      },
      { severity: 40, critical: new ThrustChannelHeatIncreased(0.5, 3) },
      { severity: 60, critical: new ThrustChannelHeatIncreased(0.5) },
      {
        severity: 70,
        critical: new OutputReduced(Math.floor(this.baseOutput / 4)),
      },
      {
        severity: 80,
        critical: new OutputReduced(Math.floor(this.baseOutput / 3)),
      },
      {
        severity: 90,
        critical: new OutputReduced(Math.floor(this.baseOutput / 2)),
      },
    ];
  }

  onSystemOffline() {
    this.onSystemPowerLevelDecrease();
  }

  onSystemPowerLevelIncrease() {
    this.onSystemPowerLevelDecrease();
  }

  onSystemPowerLevelDecrease() {
    if (
      !this.system ||
      !this.system.shipSystems ||
      !this.system.shipSystems.ship
    ) {
      return;
    }

    this.system.shipSystems.ship.movement.revertMovementsUntilValidMovement();
  }
}

export default ThrustChannelSystemStrategy;
