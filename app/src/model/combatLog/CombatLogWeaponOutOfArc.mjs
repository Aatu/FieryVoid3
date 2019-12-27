class CombatLogWeaponOutOfArc {
  constructor(fireOrderId) {
    this.fireOrderId = fireOrderId;
  }

  serialize() {
    return {
      logEntryClass: this.constructor.name,
      fireOrderId: this.fireOrderId
    };
  }

  deserialize(data = {}) {
    this.fireOrderId = data.fireOrderId;
    return this;
  }
}

export default CombatLogWeaponOutOfArc;
