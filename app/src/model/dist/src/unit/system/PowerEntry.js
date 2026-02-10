export var POWER_TYPE;
(function (POWER_TYPE) {
    POWER_TYPE["OFFLINE"] = "offline";
    POWER_TYPE["BOOST"] = "boost";
    POWER_TYPE["GO_OFFLINE"] = "go-offline";
    POWER_TYPE["GO_ONLINE"] = "go-online";
})(POWER_TYPE || (POWER_TYPE = {}));
class PowerEntry {
    type;
    amount;
    constructor(powerType = POWER_TYPE.OFFLINE, amount = 0) {
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
    setAmount(amount) {
        this.amount = amount;
    }
    serialize() {
        return {
            type: this.type,
            amount: this.amount,
        };
    }
    deserialize(data) {
        this.type = data.type;
        this.amount = data.amount || 0;
        return this;
    }
}
export default PowerEntry;
