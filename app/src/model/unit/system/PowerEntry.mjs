const POWER_TYPE_OFFLINE = "offline";
const POWER_TYPE_BOOST = "boost";
const POWER_TYPE_GO_OFFLINE = "go-offline";
const POWER_TYPE_GO_ONLINE = "go-online";

class PowerEntry {
  constructor(powerType, amount = 0) {
    this.type = powerType;
    this.amount = amount;
  }

  isOffline() {
    return this.type === POWER_TYPE_OFFLINE;
  }

  isGoingOffline() {
    return this.type === POWER_TYPE_GO_OFFLINE;
  }

  isGoingOnline() {
    return this.type === POWER_TYPE_GO_ONLINE;
  }

  isBoost() {
    return this.type === POWER_TYPE_BOOST;
  }

  getAmount() {
    return this.amount;
  }

  setAmount(amount) {
    this.amount = amount;
  }

  serialize() {
    return {
      type: this.type,
      amount: this.amount
    };
  }

  deserialize(data) {
    this.type = data.type;
    this.amount = data.amount || 0;

    return this;
  }
}

export {
  POWER_TYPE_OFFLINE,
  POWER_TYPE_BOOST,
  POWER_TYPE_GO_OFFLINE,
  POWER_TYPE_GO_ONLINE
};

export default PowerEntry;
