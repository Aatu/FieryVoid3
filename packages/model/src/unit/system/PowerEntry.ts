export enum POWER_TYPE {
  OFFLINE = "offline",
  BOOST = "boost",
  GO_OFFLINE = "go-offline",
  GO_ONLINE = "go-online",
}

export type SerializedPowerEntry = {
  type: POWER_TYPE;
  amount: number;
};

class PowerEntry {
  public type: POWER_TYPE;
  public amount: number;

  constructor(powerType: POWER_TYPE = POWER_TYPE.OFFLINE, amount = 0) {
    this.type = powerType;
    this.amount = amount;
  }

  isOffline() {
    return this.type === POWER_TYPE.OFFLINE;
  }

  isGoingOffline() {
    return this.type === POWER_TYPE.GO_OFFLINE;
  }

  isGoingOnline() {
    return this.type === POWER_TYPE.GO_ONLINE;
  }

  isBoost() {
    return this.type === POWER_TYPE.BOOST;
  }

  getAmount() {
    return this.amount;
  }

  setAmount(amount: number) {
    this.amount = amount;
  }

  serialize(): SerializedPowerEntry {
    return {
      type: this.type,
      amount: this.amount,
    };
  }

  deserialize(data: SerializedPowerEntry) {
    this.type = data.type;
    this.amount = data.amount || 0;

    return this;
  }
}

export default PowerEntry;
