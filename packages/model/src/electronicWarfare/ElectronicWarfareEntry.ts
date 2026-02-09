import { EW_TYPE } from "./electronicWarfareTypes";

export type SerializedElectronicWarfareEntry = {
  type: EW_TYPE;
  targetShipId: string;
  amount: number;
};

class ElectronicWarfareEntry {
  public type!: EW_TYPE;
  public targetShipId!: string;
  public amount!: number;

  constructor(type: EW_TYPE, targetShipId: string, amount: number) {
    this.deserialize({
      type,
      targetShipId,
      amount,
    });
  }

  clone() {
    return new ElectronicWarfareEntry(
      this.type,
      this.targetShipId,
      this.amount
    );
  }

  addAmount(amount: number) {
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

  serialize(): SerializedElectronicWarfareEntry {
    return {
      type: this.type,
      targetShipId: this.targetShipId,
      amount: this.amount,
    };
  }

  deserialize(data: SerializedElectronicWarfareEntry) {
    this.type = data.type;
    this.targetShipId = data.targetShipId;
    this.amount = data.amount;

    return this;
  }
}

export default ElectronicWarfareEntry;
