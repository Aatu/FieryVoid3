import ShipSystem from "./ShipSystem";
import { SYSTEM_HANDLERS } from "./strategy/types/SystemHandlersTypes";

export type SerializedSystemHeat = {
  heat?: number;
  overheat?: number;
};

class SystemHeat {
  private system: ShipSystem;
  private heat: number;
  private overheat: number;
  private heatTransferPerStructure: number;
  private overheatLimitPerStructure: number;
  private overheatTransferRatio: number;
  private heatTransferred: number;

  constructor(system: ShipSystem) {
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

  deserialize(data: SerializedSystemHeat) {
    this.heat = data.heat || 0;
    this.overheat = data.overheat || 0;

    return this;
  }

  getHeatTransferPerStructure() {
    return (
      this.system.callHandler(
        SYSTEM_HANDLERS.getHeatTransferPerStructure,
        null,
        0
      ) + this.heatTransferPerStructure
    );
  }

  getHeat() {
    return this.heat;
  }

  getMaxTransferHeat() {
    if (this.isHeatStorage()) {
      return 0;
    }

    return this.system.hitpoints * this.getHeatTransferPerStructure();
  }

  getOverheatTransferRatio() {
    return (
      this.system.callHandler(
        SYSTEM_HANDLERS.getOverheatTransferRatio,
        null,
        0
      ) || this.overheatTransferRatio
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
    return this.system.callHandler(SYSTEM_HANDLERS.getHeatGenerated, null, 0);
  }

  getHeatPerStructure() {
    return this.getHeat() / this.system.hitpoints;
  }

  shouldDisplayHeat() {
    return (
      this.system.callHandler(SYSTEM_HANDLERS.generatesHeat, null, false) ||
      this.isHeatStorage()
    );
  }

  predictHeatChange() {
    if (this.isHeatStorage() || this.system.isDestroyed()) {
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
      overheat,
      newHeat,
      overheatPercentage: overheat / this.getOverheatTreshold(),
      cooling: heatCooling + actualOverheatCooling,
      maxCooling: this.getMaxTransferHeat(),
      coolingPercent: (heatCooling + actualOverheatCooling) / cooling,
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
    return this.system.callHandler(SYSTEM_HANDLERS.canStoreHeat, null, false);
  }

  getMaxHeatStoreCapacity() {
    return this.system.callHandler(SYSTEM_HANDLERS.getHeatStoreAmount, null, 0);
  }

  getHeatStoreCapacity() {
    const capacity = this.getMaxHeatStoreCapacity() - this.heat;

    if (capacity <= 0) {
      return 0;
    }

    return capacity;
  }

  changeHeat(change: number) {
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
    return this.system.callHandler(
      SYSTEM_HANDLERS.getHeatRadiationCapacity,
      null,
      0
    );
  }

  radiateHeat(heat: number) {
    return this.system.callHandler(
      SYSTEM_HANDLERS.radiateHeat,
      heat,
      undefined
    );
  }

  advanceTurn() {
    this.heatTransferred = 0;
  }
}

export default SystemHeat;
