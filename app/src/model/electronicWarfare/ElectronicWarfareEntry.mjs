import * as ewTypes from "./electronicWarfareTypes.mjs";

class ElectronicWarfareEntry {
  constructor(type, targetShipId, amount) {
    this.deserialize({
      type,
      targetShipId,
      amount
    });
  }

  clone() {
    return new ElectronicWarfareEntry(
      this.type,
      this.targetShipId,
      this.amount
    );
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
      case ewTypes.EW_OFFENSIVE:
      case ewTypes.EW_DEFENSIVE:
      case ewTypes.EW_TRACKING:
      case ewTypes.EW_OFFENSIVE_SUPPORT:
      case ewTypes.EW_DEFENSIVE_SUPPORT:
        return this.amount;
      case ewTypes.EW_DISRUPTION:
        return this.amount / 3;
      case ewTypes.EW_AREA_DEFENSIVE_SUPPORT:
        return this.amount / 2.5;
    }
  }

  getEfficiency() {
    switch (this.type) {
      case ewTypes.EW_OFFENSIVE:
      case ewTypes.EW_DEFENSIVE:
      case ewTypes.EW_TRACKING:
      case ewTypes.EW_OFFENSIVE_SUPPORT:
      case ewTypes.EW_DEFENSIVE_SUPPORT:
        return 1;
      case ewTypes.EW_DISRUPTION:
        return 3;
      case ewTypes.EW_AREA_DEFENSIVE_SUPPORT:
        return 2.5;
    }
  }

  serialize() {
    return {
      type: this.type,
      targetShipId: this.targetShipId,
      amount: this.amount
    };
  }

  deserialize(data = {}) {
    this.type = data.type;
    this.targetShipId = data.targetShipId;
    this.amount = data.amount;

    this.validate();
  }

  validate() {
    if (!this.targetShipId) {
      throw new Error("ElectronicWarfareEntry must have targetShipId");
    }

    if (this.amount <= 0) {
      throw new Error("ElectronicWarfareEntry amount must be more than zero");
    }
  }
}

export default ElectronicWarfareEntry;
