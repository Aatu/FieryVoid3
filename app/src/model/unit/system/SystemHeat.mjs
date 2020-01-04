class SystemHeat {
  constructor(system) {
    this.system = system;
    this.heat = 0;

    this.heatTransferPerStructure = 1;
    this.overheatLimitPerStructure = 1;

    this.heatTransferred = 0;
  }

  serialize() {
    return {
      heat: this.heat
    };
  }

  deserialize(data = {}) {
    this.heat = data.heat || 0;

    return this;
  }

  getHeat() {
    return this.heat;
  }

  getMaxTransferHeat() {
    if (this.isHeatStorage()) {
      return 0;
    }

    return this.system.hitpoints * this.heatTransferPerStructure;
  }

  getTransferHeat() {
    const max = this.getMaxTransferHeat() - this.heatTransferred;

    if (max < 0) {
      return 0;
    }

    if (max > this.heat) {
      return this.heat;
    }

    return max;
  }

  getHeatGenerated() {
    return this.system.callHandler("getHeatGenerated", null, 0);
  }

  getHeatPerStructure() {
    return this.getHeat() / this.system.hitpoints;
  }

  shouldDisplayHeat() {
    return (
      this.system.callHandler("generatesHeat", null, false) ||
      this.isHeatStorage()
    );
  }

  generateHeat() {
    this.heat += this.getHeatGenerated();
  }

  isHeatStorage() {
    return this.system.callHandler("canStoreHeat", null, false);
  }

  getHeatStoreCapacity() {
    const capacity =
      this.system.callHandler("getHeatStoreAmount", null, 0) - this.heat;

    if (capacity <= 0) {
      return 0;
    }

    return capacity;
  }

  changeHeat(change) {
    this.heat += change;

    if (change < 0) {
      this.heatTransferred += Math.abs(change);
    }
    return this;
  }

  getOverHeat() {
    const heat = this.getHeatPerStructure();
    const overheat = heat - this.overheatLimitPerStructure;

    if (overheat <= 0) {
      return 0;
    }

    return overheat;
  }

  getRadiateHeatCapacity() {
    return this.system.callHandler("getHeatRadiationCapacity", null, 0);
  }

  radiateHeat(heat) {
    return this.system.callHandler("radiateHeat", heat);
  }

  advanceTurn() {
    this.heatTransferred = 0;
  }
}

export default SystemHeat;
