class SystemHeat {
  constructor(system) {
    this.system = system;
    this.heat = 0;
    this.overheat = 0;

    this.heatTransferPerStructure = 0.5;
    this.overheatLimitPerStructure = 1;

    this.overheatTransferRatio = 0.5;

    this.heatTransferred = 0;
  }

  serialize() {
    return {
      heat: this.heat,
      overheat: this.overheat
    };
  }

  deserialize(data = {}) {
    this.heat = data.heat || 0;
    this.overheat = data.overheat || 0;

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

  getTransferOverHeat() {
    return this.overheat * this.overheatTransferRatio;
  }

  getTransferHeat() {
    const max = this.getMaxTransferHeat() - this.heatTransferred;

    if (max <= 0) {
      return 0;
    }

    if (max > this.heat) {
      let overheatTransfer = max - this.heat;

      if (overheatTransfer > this.getTransferOverHeat()) {
        overheatTransfer = this.getTransferOverHeat();
      }

      return this.heat + overheatTransfer;
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
    const newHeat = this.getHeatGenerated();
    this.heat += newHeat;
    return newHeat;
  }

  isHeatStorage() {
    return this.system.callHandler("canStoreHeat", null, false);
  }

  getMaxHeatStoreCapacity() {
    return this.system.callHandler("getHeatStoreAmount", null, 0);
  }

  getHeatStoreCapacity() {
    const capacity = this.getMaxHeatStoreCapacity() - this.heat;

    if (capacity <= 0) {
      return 0;
    }

    return capacity;
  }

  changeHeat(change) {
    if (change < 0) {
      if (change > this.heat) {
        this.overheat += change + this.heat;
        this.heat = 0;
      } else {
        this.heat += change;
      }

      this.heatTransferred += Math.abs(change);
    } else {
      this.heat += change;
    }
    return this;
  }

  markNewOverheat() {
    if (this.isHeatStorage()) {
      return;
    }

    this.overheat += this.heat;
    this.heat = 0;
  }

  getOverheat() {
    if (this.isHeatStorage()) {
      return 0;
    }

    return this.overheat;
  }

  getOverheatTreshold() {
    return this.system.hitpoints * this.overheatLimitPerStructure;
  }

  getOverheatPercentage() {
    if (this.isHeatStorage()) {
      return 0;
    }

    return this.overheat / this.getOverheatTreshold();
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
