import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class LargerHitProfileOnlineSystemStrategy extends ShipSystemStrategy {
  constructor(front, side, hitSizeMultiplier = 0) {
    super();

    this.front = front;
    this.side = side;
    this.hitSizeMultiplier = hitSizeMultiplier;
    this.turnsOffline = 0;
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      largerHitProfileOnlineSystemStrategy: {
        turnsOffline: this.turnsOffline
      }
    };
  }

  deserialize(data = {}) {
    const thisData = data.largerHitProfileOnlineSystemStrategy || {};
    this.turnsOffline = thisData.turnsOffline || 0;

    return this;
  }

  getHitSystemSizeMultiplier(payload, previousResponse = 1) {
    if (this.turnsOffline > 1) {
      return previousResponse;
    }

    return previousResponse + this.hitSizeMultiplier;
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Increases profile when online",
      value: `${this.front}/${this.side}`
    });
    previousResponse.push({
      header: "Modifies system hit allocation size",
      value: `x${this.hitSizeMultiplier}`
    });
    previousResponse.push({
      value: `NOTE: System has to be offline more than one turn before profile increase ceases`
    });

    return previousResponse;
  }

  getHitProfile({ front = true }, previousResponse = 0) {
    if (this.turnsOffline > 1) {
      return previousResponse;
    }

    if (front) {
      return previousResponse + this.front;
    } else {
      return previousResponse + this.side;
    }
  }

  advanceTurn() {
    if (this.system.power.isDisabled()) {
      this.turnsOffline++;
    } else {
      this.turnsOffline = 0;
    }
  }
}

export default LargerHitProfileOnlineSystemStrategy;
