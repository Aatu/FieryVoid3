import { GAME_PHASE } from "../../../game/gamePhase";
import { IShipSystemStrategy } from "../../ShipSystemHandlers";
import ShipSystem from "../ShipSystem";
import ShipSystemStrategy from "./ShipSystemStrategy";
import { SYSTEM_HANDLERS } from "./types/SystemHandlersTypes";

export type SerializedBoostableSystemStrategy = {
  boostableSystemStrategy: { boostLevel: number };
};
class BoostableSystemStrategy
  extends ShipSystemStrategy
  implements IShipSystemStrategy
{
  protected power: number;
  protected maxLevel: number | null;
  protected boostLevel: number;

  constructor(power = 0, maxLevel: number | null = null) {
    super();
    this.power = power;

    this.maxLevel = maxLevel;
    this.boostLevel = 0;
  }

  isBoostable(payload: unknown, previousResponse: boolean = true): boolean {
    if (previousResponse === false) {
      return false;
    }

    return this.maxLevel !== 0;
  }

  canBoost(payload: unknown, previousResponse = true) {
    if (previousResponse === false) {
      return false;
    }

    const remainginPower = this.getSystem()
      .getShipSystems()
      .power.getRemainingPowerOutput();

    if (this.getSystem().isDisabled()) {
      return false;
    }

    if (this.maxLevel !== null && this.boostLevel >= this.maxLevel) {
      return false;
    }

    return remainginPower >= this.getPowerRequiredForBoost(undefined, 0);
  }

  canDeBoost(payload: unknown, previousResponse: unknown) {
    return this.boostLevel > 0;
  }

  getPowerRequiredForBoost(payload: unknown, previousResponse = 0) {
    return this.power + previousResponse;
  }

  getBoost(payload: unknown, previousResponse: number = 0) {
    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    return previousResponse + this.boostLevel;
  }

  getPowerRequirement(payload: unknown, previousResponse = 0) {
    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    const power = this.boostLevel * this.power;
    return power + previousResponse;
  }

  boost(payload: unknown, previousResponse: unknown) {
    if (!this.canBoost(payload)) {
      return false;
    }

    this.boostLevel++;
    this.getSystem().callHandler(
      SYSTEM_HANDLERS.onSystemPowerLevelIncrease,
      undefined,
      0
    );
  }

  deBoost(payload: unknown, previousResponse: unknown) {
    if (this.boostLevel === 0) {
      return false;
    }

    this.boostLevel--;
    this.getSystem().callHandler(
      SYSTEM_HANDLERS.onSystemPowerLevelDecrease,
      undefined,
      undefined
    );
  }

  resetBoost() {
    this.boostLevel = 0;
    this.getSystem().callHandler(
      SYSTEM_HANDLERS.onSystemPowerLevelDecrease,
      undefined,
      undefined
    );
  }

  getRequiredPhasesForReceivingPlayerData(
    payload: unknown,
    previousResponse = 1
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
    clientSystem: ShipSystem;
    phase: GAME_PHASE;
  }) {
    if (!clientSystem) {
      return;
    }

    if (this.getSystem().isDisabled()) {
      return;
    }

    const clientStrategy =
      clientSystem.getStrategiesByInstance<BoostableSystemStrategy>(
        BoostableSystemStrategy
      )[0];

    const targetBoostlevel = clientStrategy?.boostLevel;

    if (this.boostLevel > targetBoostlevel) {
      while (true) {
        if (this.boostLevel === targetBoostlevel) {
          return;
        }

        if (!this.canDeBoost(undefined, true)) {
          return;
        }

        this.deBoost(undefined, undefined);
      }
    } else if (this.boostLevel < targetBoostlevel) {
      while (true) {
        if (this.boostLevel === targetBoostlevel) {
          return;
        }

        if (!this.canBoost(undefined, true)) {
          return;
        }

        this.boost(undefined, undefined);
      }
    }
  }

  getTooltipMenuButton({ myShip }: { myShip: boolean }, previousResponse = []) {
    if (!myShip) {
      return previousResponse;
    }

    if (
      this.getSystem().isDisabled() ||
      !this.getSystem().handlers.isBoostable()
    ) {
      return previousResponse;
    }

    return [
      ...previousResponse,
      {
        sort: 100,
        img: "/img/plus.png",
        onClickHandler: () => this.getSystem().handlers.boost(),
        disabledHandler: () => !this.getSystem().handlers.canBoost(),
      },
      {
        sort: 100,
        img: "/img/minus.png",
        onClickHandler: () => this.getSystem().handlers.deBoost(),
        disabledHandler: () => !this.getSystem().handlers.canDeBoost(),
      },
    ];
  }

  serialize(
    payload: unknown,
    previousResponse = []
  ): SerializedBoostableSystemStrategy {
    return {
      ...previousResponse,
      boostableSystemStrategy: {
        boostLevel: this.boostLevel,
      },
    };
  }

  deserialize(data: SerializedBoostableSystemStrategy) {
    this.boostLevel = data.boostableSystemStrategy
      ? data.boostableSystemStrategy.boostLevel
      : 0;

    return this;
  }
}

export default BoostableSystemStrategy;
