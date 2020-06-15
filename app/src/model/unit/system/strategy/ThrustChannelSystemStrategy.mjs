import ShipSystemStrategy from "./ShipSystemStrategy.mjs";
import ThrustChannelHeatIncreased from "../criticals/ThrustChannelHeatIncreased.mjs";
import { OutputReduced } from "../criticals/index.mjs";

const directionsToString = {
  0: "Thrust forward",
  3: "Thrust aft",
  1: "Thrust starboard",
  2: "Thrust starboard",
  4: "Thrust port",
  5: "Thrust port",
  6: "Pivot right",
  7: "Pivot left",
  8: "Roll, Evade",
};

export const THRUSTER_MODE_FUSION = "fusion";
export const THRUSTER_MODE_MANEUVER = "maneuver";
export const THRUSTER_MODE_CHEMICAL = "chemical";

class ThrustChannelSystemStrategy extends ShipSystemStrategy {
  constructor(
    output,
    direction,
    { thrustHeatExtra = 0.3, fuelExtra = 0.1 } = {},
    mode = THRUSTER_MODE_FUSION,
    alternateModes = []
  ) {
    super();

    this.output = output || 0;
    this.direction = direction || 0; // 0, 3, [4,5], [1,2], 6
    this.channeled = 0;
    this.thrustHeatExtra = thrustHeatExtra;
    this.fuelExtra = fuelExtra;

    this.mode = mode;
    this.newMode = null;
    this.alternateModes = alternateModes;

    if (alternateModes.length > 0 && !alternateModes.includes(mode)) {
      alternateModes.push(mode);
    }
  }

  getBaseHeatPerThrustChanneled() {
    switch (this.mode) {
      case THRUSTER_MODE_FUSION:
        return 0.5;
      case THRUSTER_MODE_MANEUVER:
        return 0.75;
      case THRUSTER_MODE_CHEMICAL:
        return 0.1;
    }
  }

  getFuelPerThrustChanneled() {
    switch (this.mode) {
      case THRUSTER_MODE_FUSION:
        return 1;
      case THRUSTER_MODE_MANEUVER:
        return 10;
      case THRUSTER_MODE_CHEMICAL:
        return 15;
    }
  }

  isBoostable(payload, previousResponse = true) {
    if (previousResponse === false) {
      return false;
    }

    return this.mode === THRUSTER_MODE_FUSION;
  }

  canBoost(payload, previousResponse = true) {
    if (previousResponse === false) {
      return false;
    }

    return this.mode === THRUSTER_MODE_FUSION;
  }

  canChangeMode() {
    return this.alternateModes.length > 1;
  }

  changeMode() {
    if (!this.canChangeMode()) {
      throw new Error("Check validity first");
    }

    let index = this.alternateModes.indexOf(this.mode);

    if (index === this.alternateModes.length - 1) {
      index = 0;
    } else {
      index++;
    }

    this.mode = this.alternateModes[index];
    this.newMode = this.mode;
    this.system.callHandler("resetBoost");
  }

  getHeatTransferPerStructure(payload, previousResponse = 0) {
    if (this.mode === THRUSTER_MODE_FUSION) {
      const boost = this.system.callHandler("getBoost", null, 0);

      return previousResponse + boost * 0.12;
    }

    return previousResponse;
  }

  getFuelRequirement(amount = null) {
    let fuel = 0;
    let extra = 1;

    if (amount === null) {
      amount = this.channeled;
    }

    while (amount--) {
      const increase = this.getFuelPerThrustChanneled() * extra;
      fuel += increase;
      extra += this.fuelExtra;
    }

    return Math.round(fuel);
  }

  resetChanneledThrust() {
    this.channeled = 0;
  }

  addChanneledThrust(channel) {
    this.channeled += channel;
  }

  setChanneledThrust(channel) {
    this.channeled = channel;
  }

  getChanneledThrust() {
    return this.channeled;
  }

  getIconText() {
    return this.channeled + "/" + this.getThrustOutput();
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      thrustChannelSystemStrategy: {
        channeled: this.channeled,
        newMode: this.newMode,
        mode: this.mode,
      },
    };
  }

  deserialize(data = {}) {
    const thisData = data.thrustChannelSystemStrategy || {};
    this.channeled = thisData.channeled || 0;
    this.newMode = thisData.newMode || null;
    this.mode = thisData.mode || this.mode;

    return this;
  }

  getDirectionString() {
    if (Array.isArray(this.direction)) {
      return this.direction
        .map((direction) => directionsToString[direction])
        .join(", ");
    }

    return directionsToString[this.direction];
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Mode",
      value: this.mode.charAt(0).toUpperCase() + this.mode.substring(1),
    });

    previousResponse.push({
      header: "Output",
      value: this.getThrustOutput(),
    });

    previousResponse.push({
      header: "Manouver(s)",
      value: this.getDirectionString(),
    });

    previousResponse.push({
      header: "Channeled",
      value: this.channeled,
    });

    previousResponse.push({
      header: "Fuel expended",
      value: this.getFuelRequirement(),
    });

    return previousResponse;
  }

  getBackgroundImage() {
    if (this.mode === THRUSTER_MODE_FUSION) {
      if (this.callHandler("isDirection", 3, false)) {
        return "/img/system/thruster2.png";
      } else if (this.callHandler("isDirection", 2, false)) {
        return "/img/system/thruster4.png";
      } else if (this.callHandler("isDirection", 5, false)) {
        return "/img/system/thruster3.png";
      }
      return "/img/system/thruster1.png";
    } else {
      if (this.callHandler("isDirection", 3, false)) {
        return "/img/system/thrusterC2.png";
      } else if (this.callHandler("isDirection", 2, false)) {
        return "/img/system/thrusterC4.png";
      } else if (this.callHandler("isDirection", 5, false)) {
        return "/img/system/thrusterC3.png";
      }
      return "/img/system/thrusterC1.png";
    }
  }

  getTooltipMenuButton({ myShip }, previousResponse = []) {
    if (!myShip) {
      return previousResponse;
    }

    if (this.system.isDisabled()) {
      return previousResponse;
    }

    if (!this.canChangeMode()) {
      return previousResponse;
    }

    return [
      ...previousResponse,
      {
        sort: 50,
        img:
          this.mode === THRUSTER_MODE_FUSION
            ? "/img/system/thrusterC1.png"
            : "/img/system/thruster1.png",
        onClickHandler: this.changeMode.bind(this),
        onDisabledHandler: () => false,
      },
    ];
  }

  generatesHeat() {
    return true;
  }

  getHeatPerThrustChanneled() {
    let heat = this.getBaseHeatPerThrustChanneled();

    heat *=
      1 +
      this.system.damage
        .getCriticals()
        .filter((critical) => critical instanceof ThrustChannelHeatIncreased)
        .reduce((total, current) => total + current.getHeatIncrease(), 0);

    return heat;
  }

  getHeatGenerated(payload, previousResponse = 0) {
    let count = this.channeled;
    let extra = 1;
    let heat = 0;

    const boost = this.system.callHandler("getBoost", null, 0) * 0.05;
    let extraIncrement = this.thrustHeatExtra - boost * 0.01;

    if (extraIncrement < 0.01) {
      extraIncrement = 0.01;
    }

    while (count--) {
      const increase = this.getHeatPerThrustChanneled() * extra;
      heat += increase;
      extra += extraIncrement;
    }

    return previousResponse + heat;
  }

  getThrustDirection(payload, previousResponse = null) {
    return this.direction;
  }

  getThrustOutput(payload, previousResponse = 0) {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    let output = this.output;

    output -= this.system.damage
      .getCriticals()
      .filter((critical) => critical instanceof OutputReduced)
      .reduce((total, current) => total + current.getOutputReduction(), 0);

    output += this.system.callHandler("getBoost", null, 0);

    if (output < 0) {
      output = 0;
    }

    return previousResponse + output;
  }

  getMaxChannelAmount() {
    return this.getThrustOutput();
  }

  canChannelAmount(amount) {
    return amount <= this.getMaxChannelAmount();
  }

  getChannelCost(amount) {
    return amount;
  }

  isThruster(payload, previousResponse = 0) {
    return true;
  }

  isDirection(direction) {
    return (
      this.direction === direction ||
      (Array.isArray(this.direction) && this.direction.includes(direction))
    );
  }

  getRequiredPhasesForReceivingPlayerData(payload, previousResponse = 1) {
    if (previousResponse > 3) {
      return previousResponse;
    }

    return 3;
  }

  receivePlayerData({ clientSystem, phase }) {
    if (phase !== 3) {
      return;
    }

    if (!clientSystem) {
      return;
    }

    if (this.system.isDisabled()) {
      return;
    }

    const clientStrategy = clientSystem.getStrategiesByInstance(
      ThrustChannelSystemStrategy
    )[0];

    const targetMode = clientStrategy.newMode;

    if (targetMode === null) {
      return;
    }

    if (!this.canChangeMode() || !this.alternateModes.includes(targetMode)) {
      throw new Error(`This system can not change mode to ${targetMode}`);
    }

    this.mode = targetMode;
    this.targetMode = null;
    this.system.callHandler("resetBoost");
  }

  advanceTurn() {
    this.channeled = 0;
    this.targetMode = null;
  }

  getPossibleCriticals(payload, previousResponse = []) {
    return [
      ...previousResponse,

      { severity: 20, critical: new ThrustChannelHeatIncreased(0.5, 1) },
      {
        severity: 30,
        critical: new OutputReduced(Math.ceil(this.output / 4), 2),
      },
      { severity: 40, critical: new ThrustChannelHeatIncreased(0.5, 3) },
      { severity: 60, critical: new ThrustChannelHeatIncreased(0.5) },
      { severity: 70, critical: new OutputReduced(Math.ceil(this.output / 4)) },
      { severity: 80, critical: new OutputReduced(Math.ceil(this.output / 3)) },
      { severity: 90, critical: new OutputReduced(Math.ceil(this.output / 2)) },
    ];
  }

  onSystemOffline() {
    this.onSystemPowerLevelDecrease();
  }

  onSystemPowerLevelIncrease() {
    this.onSystemPowerLevelDecrease();
  }

  onSystemPowerLevelDecrease() {
    if (
      !this.system ||
      !this.system.shipSystems ||
      !this.system.shipSystems.ship
    ) {
      return;
    }

    this.system.shipSystems.ship.movement.revertMovementsUntilValidMovement();
  }
}

export default ThrustChannelSystemStrategy;
