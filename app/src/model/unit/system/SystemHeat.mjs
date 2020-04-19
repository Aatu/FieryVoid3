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
      overheat: this.overheat,
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

  getOverheatTransferRatio() {
    return (
      this.system.callHandler("getOverheatTransferRatio", null, 0) ||
      this.overheatTransferRatio
    );
  }

  getTransferOverHeat() {
    const ratio = this.getOverheatTransferRatio();
    const overheat = this.overheat > 0 ? this.overheat : 0;
    const withRatio = overheat * ratio;
    if (withRatio < ratio) {
      if (ratio > overheat) {
        return overheat;
      }
      return ratio;
    }

    return withRatio;
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

  predictHeatChange() {
    if (this.isHeatStorage()) {
      return {
        overheat: 0,
        newHeat: 0,
        overheatPercentage: 0,
        cooling: 0,
        overHeatThreshold: 0,
        maximumPossibleOverheatReduction: 0,
      };
    }

    const newHeat = this.getHeatGenerated();
    const heat = this.heat + newHeat;
    const cooling = this.getMaxTransferHeat();
    const finalHeat = heat >= cooling ? heat - cooling : 0;

    const heatCooling = cooling > heat ? heat : cooling;

    const maxOverheatCooling =
      heatCooling < cooling ? cooling - heatCooling : 0;

    const overheatCooling =
      maxOverheatCooling > this.overheat * this.getOverheatTransferRatio()
        ? this.overheat * this.getOverheatTransferRatio()
        : maxOverheatCooling;

    const cumulatedOverheat = this.overheat + finalHeat;

    const actualOverheatCooling =
      overheatCooling <= cumulatedOverheat
        ? overheatCooling
        : cumulatedOverheat;

    const overheat = cumulatedOverheat - actualOverheatCooling;

    const maximumPossibleOverheatReduction = this.getOverheatTransferRatio();

    return {
      overheat: Math.round(overheat * 100) / 100,
      newHeat,
      overheatPercentage: overheat / this.getOverheatTreshold(),
      cooling: Math.round((heatCooling + actualOverheatCooling) * 100) / 100,
      overHeatThreshold: this.getOverheatTreshold(),
      maximumPossibleOverheatReduction,
    };
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

  getOverheatPercentage(extra = 0) {
    if (this.isHeatStorage()) {
      return 0;
    }

    return (this.overheat + extra) / this.getOverheatTreshold();
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
