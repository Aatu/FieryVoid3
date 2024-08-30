import ShipSystemStrategy from "./ShipSystemStrategy";
import ThrustChannelHeatIncreased from "../criticals/ThrustChannelHeatIncreased";
import { OutputReduced } from "../criticals/index";
import { SYSTEM_HANDLERS, SystemMessage } from "./types/SystemHandlersTypes";
import { SystemTooltipMenuButton } from "../../ShipSystemHandlers";
import { GAME_PHASE } from "../../../game/gamePhase";

export type SerializedThrustChannelSystemStrategy = {
  thrustChannelSystemStrategy?: {
    channeled?: number;
    newMode?: THRUSTER_MODE | null;
    mode?: THRUSTER_MODE;
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

class ThrustChannelSystemStrategy extends ShipSystemStrategy {
  private output: number;
  private direction: THRUSTER_DIRECTION | THRUSTER_DIRECTION[];
  private channeled: number;
  private thrustHeatExtra: number;
  private fuelExtra: number;
  private mode: THRUSTER_MODE;
  private newMode: THRUSTER_MODE | null;
  public targetMode: THRUSTER_MODE | null;
  private alternateModes: THRUSTER_MODE[];

  constructor(
    output: number,
    direction: THRUSTER_DIRECTION | THRUSTER_DIRECTION[],
    {
      thrustHeatExtra = 0.3,
      fuelExtra = 0.1,
    }: { thrustHeatExtra?: number; fuelExtra?: number } = {},
    mode: THRUSTER_MODE = THRUSTER_MODE.FUSION,
    alternateModes: THRUSTER_MODE[] = []
  ) {
    super();

    this.output = output || 0;
    this.direction = direction || 0; // 0, 3, [4,5], [1,2], 6
    this.channeled = 0;
    this.thrustHeatExtra = thrustHeatExtra;
    this.fuelExtra = fuelExtra;
    this.targetMode = null;

    this.mode = mode;
    this.newMode = null;
    this.alternateModes = alternateModes;

    if (alternateModes.length > 0 && !alternateModes.includes(mode)) {
      alternateModes.push(mode);
    }
  }

  getBaseHeatPerThrustChanneled() {
    switch (this.mode) {
      case THRUSTER_MODE.FUSION:
        return 0.5;
      case THRUSTER_MODE.MANEUVER:
        return 0.75;
      case THRUSTER_MODE.CHEMICAL:
        return 0.1;
    }
  }

  getFuelPerThrustChanneled() {
    switch (this.mode) {
      case THRUSTER_MODE.FUSION:
        return 1;
      case THRUSTER_MODE.MANEUVER:
        return 10;
      case THRUSTER_MODE.CHEMICAL:
        return 15;
    }
  }

  isBoostable(payload: unknown, previousResponse = true): boolean {
    if (previousResponse === false) {
      return false;
    }

    return this.mode === THRUSTER_MODE.FUSION;
  }

  canBoost(payload: unknown, previousResponse = true): boolean {
    if (previousResponse === false) {
      return false;
    }

    return this.mode === THRUSTER_MODE.FUSION;
  }

  canChangeMode() {
    return this.alternateModes.length > 1;
  }

  changeMode() {
    if (!this.canChangeMode()) {
      throw new Error("Check validity first");
    }

    let index = this.alternateModes.indexOf(this.mode);

    if (index === this.alternateModes.length - 1) {
      index = 0;
    } else {
      index++;
    }

    this.mode = this.alternateModes[index];
    this.newMode = this.mode;
    this.getSystem().callHandler(
      SYSTEM_HANDLERS.resetBoost,
      undefined,
      undefined
    );
  }

  getHeatTransferPerStructure(payload: unknown, previousResponse = 0): number {
    if (this.mode === THRUSTER_MODE.FUSION) {
      const boost = this.getSystem().callHandler(
        SYSTEM_HANDLERS.getBoost,
        null,
        0
      );

      return previousResponse + boost * 0.12;
    }

    return previousResponse;
  }

  getFuelRequirement(amount: number | null = null): number {
    let fuel = 0;
    let extra = 1;

    if (amount === null) {
      amount = this.channeled;
    }

    while (amount--) {
      const increase = this.getFuelPerThrustChanneled() * extra;
      fuel += increase;
      extra += this.fuelExtra;
    }

    return Math.round(fuel);
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
    return this.channeled + "/" + this.getThrustOutput(undefined, 0);
  }

  serialize(
    payload: unknown,
    previousResponse = []
  ): SerializedThrustChannelSystemStrategy {
    return {
      ...previousResponse,
      thrustChannelSystemStrategy: {
        channeled: this.channeled,
        newMode: this.newMode,
        mode: this.mode,
      },
    };
  }

  deserialize(data: SerializedThrustChannelSystemStrategy = {}) {
    const thisData = data.thrustChannelSystemStrategy || {};
    this.channeled = thisData.channeled || 0;
    this.newMode = thisData.newMode || null;
    this.mode = thisData.mode || this.mode;

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
    previousResponse.push({
      header: "Mode",
      value: this.mode.charAt(0).toUpperCase() + this.mode.substring(1),
    });

    previousResponse.push({
      header: "Output",
      value: this.getThrustOutput(undefined, 0).toString(),
    });

    previousResponse.push({
      header: "Manouver(s)",
      value: this.getDirectionString(),
    });

    previousResponse.push({
      header: "Channeled",
      value: this.channeled.toString(),
    });

    previousResponse.push({
      header: "Fuel expended",
      value: this.getFuelRequirement().toString(),
    });

    return previousResponse;
  }

  getBackgroundImage() {
    if (this.mode === THRUSTER_MODE.FUSION) {
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
    } else {
      if (
        this.callHandler(
          SYSTEM_HANDLERS.isDirection,
          THRUSTER_DIRECTION.AFT,
          false
        )
      ) {
        return "/img/system/thrusterC2.png";
      } else if (
        this.callHandler(
          SYSTEM_HANDLERS.isDirection,
          THRUSTER_DIRECTION.STARBOARD_AFT,
          false
        )
      ) {
        return "/img/system/thrusterC4.png";
      } else if (
        this.callHandler(
          SYSTEM_HANDLERS.isDirection,
          THRUSTER_DIRECTION.PORT_AFT,
          false
        )
      ) {
        return "/img/system/thrusterC3.png";
      }
      return "/img/system/thrusterC1.png";
    }
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
        img:
          this.mode === THRUSTER_MODE.FUSION
            ? "/img/system/thrusterC1.png"
            : "/img/system/thruster1.png",
        clickHandler: this.changeMode.bind(this),
      },
    ];
  }

  generatesHeat() {
    return true;
  }

  getHeatPerThrustChanneled() {
    let heat = this.getBaseHeatPerThrustChanneled();

    heat *=
      1 +
      this.getSystem()
        .damage.getCriticals()
        .filter((critical) => critical instanceof ThrustChannelHeatIncreased)
        .reduce((total, current) => total + current.getHeatIncrease(), 0);

    return heat;
  }

  getHeatGenerated(payload: unknown, previousResponse = 0) {
    let count = this.channeled;
    let extra = 1;
    let heat = 0;

    const boost =
      this.getSystem().callHandler(SYSTEM_HANDLERS.getBoost, null, 0) * 0.05;
    //TODO: Should following line have a + instead of a -?
    let extraIncrement = this.thrustHeatExtra - boost * 0.01;

    if (extraIncrement < 0.01) {
      extraIncrement = 0.01;
    }

    while (count--) {
      const increase = this.getHeatPerThrustChanneled() * extra;
      heat += increase;
      extra += extraIncrement;
    }

    return previousResponse + heat;
  }

  getThrustDirection(payload: unknown, previousResponse = null) {
    return this.direction;
  }

  getThrustOutput(payload: undefined, previousResponse = 0) {
    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    let output = this.output;

    output -= this.getSystem()
      .damage.getCriticals()
      .filter((critical) => critical instanceof OutputReduced)
      .reduce((total, current) => total + current.getOutputReduction(), 0);

    output += this.getSystem().callHandler(SYSTEM_HANDLERS.getBoost, null, 0);

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

  isDirection(direction: THRUSTER_DIRECTION) {
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

    const targetMode = clientStrategy.newMode;

    if (targetMode === null) {
      return;
    }

    if (!this.canChangeMode() || !this.alternateModes.includes(targetMode)) {
      throw new Error(`This system can not change mode to ${targetMode}`);
    }

    this.mode = targetMode;
    this.targetMode = null;
    this.getSystem().callHandler(
      SYSTEM_HANDLERS.resetBoost,
      undefined,
      undefined
    );
  }

  advanceTurn() {
    this.channeled = 0;
    this.targetMode = null;
  }

  getPossibleCriticals(payload: unknown, previousResponse = []) {
    return [
      ...previousResponse,

      { severity: 20, critical: new ThrustChannelHeatIncreased(0.5, 1) },
      {
        severity: 30,
        critical: new OutputReduced(Math.ceil(this.output / 4), 2),
      },
      { severity: 40, critical: new ThrustChannelHeatIncreased(0.5, 3) },
      { severity: 60, critical: new ThrustChannelHeatIncreased(0.5) },
      { severity: 70, critical: new OutputReduced(Math.ceil(this.output / 4)) },
      { severity: 80, critical: new OutputReduced(Math.ceil(this.output / 3)) },
      { severity: 90, critical: new OutputReduced(Math.ceil(this.output / 2)) },
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
