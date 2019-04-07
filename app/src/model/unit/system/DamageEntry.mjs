class DamageEntry {
  constructor(amount, fireId) {
    this.amount = amount;
    this.fireId = fireId || null;
  }

  serialize() {
    return {
      amount: this.amount,
      fireId: this.fireId
    };
  }

  deserialize(data) {
    this.amount = data.amount || 0;
    this.fireId = data.fireId || null;

    return this;
  }

  getDamage() {
    return this.amount;
  }

  advanceTurn() {
    return this;
  }
}

export default DamageEntry;
