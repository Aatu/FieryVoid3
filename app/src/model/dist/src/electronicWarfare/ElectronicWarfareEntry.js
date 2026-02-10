import { EW_TYPE } from "./electronicWarfareTypes";
class ElectronicWarfareEntry {
    type;
    targetShipId;
    amount;
    constructor(type, targetShipId, amount) {
        this.deserialize({
            type,
            targetShipId,
            amount,
        });
    }
    clone() {
        return new ElectronicWarfareEntry(this.type, this.targetShipId, this.amount);
    }
    addAmount(amount) {
        this.amount += amount;
    }
    getAmount() {
        return this.amount;
    }
    getType() {
        return this.type;
    }
    getActualPower() {
        switch (this.type) {
            case EW_TYPE.OFFENSIVE:
            case EW_TYPE.DEFENSIVE:
            case EW_TYPE.CC:
            case EW_TYPE.OFFENSIVE_SUPPORT:
            case EW_TYPE.DEFENSIVE_SUPPORT:
                return this.amount;
            case EW_TYPE.DISRUPTION:
                return this.amount / 3;
            case EW_TYPE.AREA_DEFENSIVE_SUPPORT:
                return this.amount / 2.5;
        }
    }
    getEfficiency() {
        switch (this.type) {
            case EW_TYPE.OFFENSIVE:
            case EW_TYPE.DEFENSIVE:
            case EW_TYPE.CC:
            case EW_TYPE.OFFENSIVE_SUPPORT:
            case EW_TYPE.DEFENSIVE_SUPPORT:
                return 1;
            case EW_TYPE.DISRUPTION:
                return 3;
            case EW_TYPE.AREA_DEFENSIVE_SUPPORT:
                return 2.5;
        }
    }
    serialize() {
        return {
            type: this.type,
            targetShipId: this.targetShipId,
            amount: this.amount,
        };
    }
    deserialize(data) {
        this.type = data.type;
        this.targetShipId = data.targetShipId;
        this.amount = data.amount;
        return this;
    }
}
export default ElectronicWarfareEntry;
