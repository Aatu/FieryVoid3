import ShipSystemStrategy from "../ShipSystemStrategy";
import { LoadingTimeIncreased } from "../../criticals/index";
import { SYSTEM_HANDLERS, SystemMessage } from "../types/SystemHandlersTypes";

type SerializedStandardLoadingStrategy = {
  standardLoadingStrategy: { turnsLoaded: number };
};

class StandardLoadingStrategy extends ShipSystemStrategy {
  private loadingTime: number;
  private turnsLoaded: number;
  private firedThisTurn: boolean;

  constructor(loadingTime: number) {
    super();
    this.loadingTime = loadingTime;
    this.turnsLoaded = loadingTime;
    this.firedThisTurn = false;
  }

  getMessages(
    payload: unknown,
    previousResponse: SystemMessage[] = []
  ): SystemMessage[] {
    const boostLoading = this.getBoostLoading();
    let loading = 1 + boostLoading;

    if (!Number.isInteger(loading)) {
      loading = Math.floor(loading);
    }

    let turnsLoaded = this.turnsLoaded;

    if (!Number.isInteger(turnsLoaded)) {
      turnsLoaded = Math.floor(turnsLoaded);
    }

    const loadingTime = this.getLoadingTime();

    if (turnsLoaded > loadingTime) {
      turnsLoaded = loadingTime;
    }

    previousResponse.push({
      header: "Loading",
      value: `${turnsLoaded} / ${loadingTime} +${loading} per turn`,
    });

    const boostPower = this.getSystem().callHandler(
      SYSTEM_HANDLERS.getPowerRequiredForBoost,
      null,
      0
    );

    if (boostPower) {
      previousResponse.push({
        header: "Loading boostable",
        value: `${boostPower} power required`,
      });
    }

    return previousResponse;
  }

  private getTurnsUntilLoaded() {
    const left = this.getLoadingTime() - this.turnsLoaded;
    const loadingPerTurn = 1 + this.getBoostLoading();

    return Math.ceil(left / loadingPerTurn);
  }

  getIconText(payload: undefined, previousResponse = ""): string {
    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    const left = this.getTurnsUntilLoaded();
    if (left <= 0) {
      return previousResponse;
    }

    return `-${left}T`;
  }

  canFire(payload: unknown, previousResponse = true) {
    if (!this.isLoaded()) {
      return false;
    }

    return previousResponse;
  }

  usesLoading() {
    return true;
  }

  onWeaponFired() {
    this.firedThisTurn = true;
  }

  getLoadingTime() {
    const extra = this.getSystem()
      .damage.getCriticals()
      .filter((critical) => critical instanceof LoadingTimeIncreased)
      .reduce((total, current) => total + current.getLoadingTimeIncrease(), 0);

    return this.loadingTime + extra;
  }

  getTurnsLoaded() {
    return this.turnsLoaded;
  }

  isReady(payload: unknown, previousResponse = null) {
    if (previousResponse === false) {
      return false;
    }

    return this.isLoaded();
  }

  isLoaded() {
    return this.turnsLoaded >= this.getLoadingTime();
  }

  serialize(
    payload: unknown,
    previousResponse = []
  ): SerializedStandardLoadingStrategy {
    return {
      ...previousResponse,
      standardLoadingStrategy: {
        turnsLoaded: this.turnsLoaded,
      },
    };
  }

  deserialize(data: SerializedStandardLoadingStrategy) {
    this.turnsLoaded = data.standardLoadingStrategy
      ? data.standardLoadingStrategy.turnsLoaded
      : 0;

    return this;
  }

  advanceTurn() {
    if (this.getSystem().isDisabled()) {
      this.turnsLoaded = 0;
      return;
    }

    if (this.firedThisTurn) {
      this.turnsLoaded = 0;
      this.firedThisTurn = false;
    }

    const loadingStep = 1 + this.getBoostLoading();
    this.turnsLoaded += loadingStep;
  }

  private getBoostLoading() {
    let boost = this.getSystem().handlers.getBoost();

    if (!boost) {
      return 0;
    }

    const targetLoading = this.getLoadingTime() - boost;
    return this.getLoadingTime() / targetLoading - 1;
  }

  getPossibleCriticals(payload: unknown, previousResponse = []) {
    return [
      ...previousResponse,
      {
        severity: 40,
        critical: new LoadingTimeIncreased(this.loadingTime, 1),
      },
      {
        severity: 80,
        critical: new LoadingTimeIncreased(this.loadingTime * 3, 1),
      },
      { severity: 100, critical: new LoadingTimeIncreased(null, 1) },
    ];
  }
}

export default StandardLoadingStrategy;
