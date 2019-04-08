const POWER_TYPE_OFFLINE = "offline";
const POWER_TYPE_BOOST = "boost";

class PowerEntry {
  constructor(powerType, amount = 0) {
    this.type = powerType;
    this.amount = amount;
  }

  isOffline() {
    return this.type === POWER_TYPE_OFFLINE;
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
}

export { POWER_TYPE_OFFLINE, POWER_TYPE_BOOST };
export default PowerEntry;
