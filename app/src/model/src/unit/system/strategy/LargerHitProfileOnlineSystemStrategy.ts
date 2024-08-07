import ShipSystemStrategy from "./ShipSystemStrategy";
import { SystemMessage } from "./types/SystemHandlersTypes";

export type SerializedLargerHitProfileOnlineSystemStrategy = {
  largerHitProfileOnlineSystemStrategy?: {
    turnsOffline?: number;
  };
};

class LargerHitProfileOnlineSystemStrategy extends ShipSystemStrategy {
  private front: number;
  private side: number;
  private hitSizeMultiplier: number;
  private turnsOffline: number;

  constructor(front: number, side: number, hitSizeMultiplier: number = 0) {
    super();

    this.front = front;
    this.side = side;
    this.hitSizeMultiplier = hitSizeMultiplier;
    this.turnsOffline = 0;
  }

  serialize(
    payload: unknown,
    previousResponse = []
  ): SerializedLargerHitProfileOnlineSystemStrategy {
    return {
      ...previousResponse,
      largerHitProfileOnlineSystemStrategy: {
        turnsOffline: this.turnsOffline,
      },
    };
  }

  deserialize(data: SerializedLargerHitProfileOnlineSystemStrategy = {}) {
    const thisData = data.largerHitProfileOnlineSystemStrategy || {};
    this.turnsOffline = thisData.turnsOffline || 0;

    return this;
  }

  getHitSystemSizeMultiplier(payload: unknown, previousResponse = 1) {
    if (
      (this.getSystem().isDestroyed() && this.turnsOffline > 0) ||
      this.turnsOffline > 1
    ) {
      return previousResponse;
    }

    return previousResponse + this.hitSizeMultiplier;
  }

  getMessages(payload: unknown, previousResponse: SystemMessage[] = []) {
    previousResponse.push({
      header: "Increases profile when online",
      value: `${this.front}/${this.side}`,
    });
    previousResponse.push({
      header: "Modifies system hit allocation size",
      value: `x${this.hitSizeMultiplier}`,
    });

    if (!this.getSystem().isDestroyed()) {
      if (this.turnsOffline > 1) {
        previousResponse.push({
          value: `NOTE: System has been offline long enough for the profile increase to cease.`,
        });
      } else {
        previousResponse.push({
          value: `NOTE: System has to be offline ${
            2 - this.turnsOffline
          } turn(s) before profile increase ceases.`,
        });
      }
    } else {
      previousResponse.push({
        value: `NOTE: Destroyed system will not increase ship profile.`,
      });
    }

    return previousResponse;
  }

  getHitProfile({ front = true }, previousResponse = 0) {
    if (
      (this.getSystem().isDestroyed() && this.turnsOffline > 0) ||
      this.turnsOffline > 1
    ) {
      return previousResponse;
    }

    if (front) {
      return previousResponse + this.front;
    } else {
      return previousResponse + this.side;
    }
  }

  advanceTurn() {
    if (this.getSystem().isDisabled()) {
      this.turnsOffline++;
    } else {
      this.turnsOffline = 0;
    }
  }

  onGameStart() {
    if (this.getSystem().power.isOnline()) {
      this.getSystem().power.setOffline();
    }

    this.turnsOffline = 99;
  }
}

export default LargerHitProfileOnlineSystemStrategy;
