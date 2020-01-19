import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class AlwaysTargetableSystemStrategy extends ShipSystemStrategy {
  constructor(turnsOfflineToCancel = null) {
    super();

    this.turnsOfflineToCancel = turnsOfflineToCancel;
    this.turnsOffline = 0;
  }

  canBeTargeted(payload, previousResponse = false) {
    if (this.system.isDestroyed()) {
      return previousResponse;
    }

    if (
      this.turnsOfflineToCancel !== null &&
      this.turnsOffline >= this.turnsOfflineToCancel
    ) {
      return previousResponse;
    }

    return true;
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      alwaysTargetableSystemStrategy: {
        turnsOffline: this.turnsOffline
      }
    };
  }

  deserialize(data = {}) {
    const thisData = data.alwaysTargetableSystemStrategy || {};
    this.turnsOffline = thisData.turnsOffline || 0;

    return this;
  }

  getMessages(payload, previousResponse = []) {
    if (this.system.isDestroyed()) {
      return previousResponse;
    }

    if (this.turnsOfflineToCancel === null) {
      previousResponse.push({
        value: `This system can always be hit, regardless of attack direction`
      });
    } else {
      if (this.turnsOffline >= this.turnsOfflineToCancel) {
        previousResponse.push({
          value: `This system has been ofline long enough to not be a valid target`
        });
      } else {
        previousResponse.push({
          value: `This system has to be ofline ${this.turnsOfflineToCancel -
            this.turnsOffline} more turn to not be a valid target`
        });
      }
    }

    return previousResponse;
  }

  advanceTurn() {
    if (this.system.isDisabled()) {
      this.turnsOffline++;
    } else {
      this.turnsOffline = 0;
    }
  }
}

export default AlwaysTargetableSystemStrategy;
