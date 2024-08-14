import ShipSystemStrategy from "./ShipSystemStrategy";
import { SystemMessage } from "./types/SystemHandlersTypes";

interface SerializedAlwaysTargetableSystemStrategy {
  turnsOffline: number;
}

class AlwaysTargetableSystemStrategy extends ShipSystemStrategy {
  private turnsOfflineToCancel: number | null;
  private turnsOffline: number;

  constructor(turnsOfflineToCancel: number | null = null) {
    super();

    this.turnsOfflineToCancel = turnsOfflineToCancel;
    this.turnsOffline = 0;
  }

  public canBeTargeted = (_: unknown, previousResponse = false): boolean => {
    if (this.getSystem().isDestroyed()) {
      return previousResponse;
    }

    if (
      this.turnsOfflineToCancel !== null &&
      this.turnsOffline >= this.turnsOfflineToCancel
    ) {
      return previousResponse;
    }

    return true;
  };

  serialize = (
    payload: unknown,
    previousResponse: Record<string, unknown> = {}
  ): typeof previousResponse & {
    alwaysTargetableSystemStrategy: SerializedAlwaysTargetableSystemStrategy;
  } => {
    return {
      ...previousResponse,
      alwaysTargetableSystemStrategy: {
        turnsOffline: this.turnsOffline,
      },
    };
  };

  deserialize(
    data: {
      alwaysTargetableSystemStrategy?: SerializedAlwaysTargetableSystemStrategy;
    } = {}
  ) {
    const thisData = data.alwaysTargetableSystemStrategy;
    this.turnsOffline = thisData?.turnsOffline || 0;

    return this;
  }

  getMessages = (
    _: unknown,
    previousResponse: SystemMessage[] = []
  ): SystemMessage[] => {
    if (this.getSystem().isDestroyed()) {
      return previousResponse;
    }

    if (this.turnsOfflineToCancel === null) {
      previousResponse.push({
        value: `This system can always be hit, regardless of attack direction`,
      });
    } else {
      if (this.turnsOffline >= this.turnsOfflineToCancel) {
        previousResponse.push({
          value: `This system has been ofline long enough to not be a valid target`,
        });
      } else {
        previousResponse.push({
          value: `This system has to be ofline ${
            this.turnsOfflineToCancel - this.turnsOffline
          } more turn to not be a valid target`,
        });
      }
    }

    return previousResponse;
  };

  advanceTurn() {
    if (this.getSystem().isDisabled()) {
      this.turnsOffline++;
    } else {
      this.turnsOffline = 0;
    }
  }
}

export default AlwaysTargetableSystemStrategy;
