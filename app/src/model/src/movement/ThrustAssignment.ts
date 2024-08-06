import ShipSystem from "../unit/system/ShipSystem";
import { THRUSTER_DIRECTION } from "../unit/system/strategy/ThrustChannelSystemStrategy";
import { SYSTEM_HANDLERS } from "../unit/system/strategy/types/SystemHandlersTypes";

class ThrustAssignment {
  private thruster: ShipSystem;
  private directions: THRUSTER_DIRECTION[];
  private paid: number;
  private channeled: number;
  private capacity: number;
  private assigned: number;

  constructor(thruster: ShipSystem) {
    this.thruster = thruster;

    this.directions = ([] as THRUSTER_DIRECTION[]).concat(
      thruster.callHandler(
        SYSTEM_HANDLERS.getThrustDirection,
        undefined,
        THRUSTER_DIRECTION.FORWARD
      )
    );
    this.paid = 0;
    this.channeled = 0;
    this.capacity = thruster.callHandler(
      SYSTEM_HANDLERS.getThrustOutput,
      null,
      0
    );
    this.assigned = 0;
  }

  addAssigned(amount: number) {
    this.assigned += amount;
  }

  getOverheat() {
    const oldChannel = this.thruster.callHandler(
      SYSTEM_HANDLERS.getChanneledThrust,
      null,
      0
    );
    this.thruster.callHandler(
      SYSTEM_HANDLERS.setChanneledThrust,
      this.channeled,
      undefined
    );

    const payload = this.thruster.heat.predictHeatChange();

    this.thruster.callHandler(
      SYSTEM_HANDLERS.setChanneledThrust,
      oldChannel,
      undefined
    );

    return payload;
  }

  getFuelRequirement() {
    return this.thruster.callHandler(
      SYSTEM_HANDLERS.getFuelRequirement,
      this.channeled,
      0
    );
  }

  getNextThrustFuelCost() {
    return (
      this.thruster.callHandler(
        SYSTEM_HANDLERS.getFuelRequirement,
        this.channeled + 1,
        0
      ) -
      this.thruster.callHandler(
        SYSTEM_HANDLERS.getFuelRequirement,
        this.channeled,
        0
      )
    );
  }

  isDirection(direction: THRUSTER_DIRECTION) {
    return this.directions.includes(direction);
  }

  canChannel() {
    return this.channeled < this.capacity;
  }

  getThrustCapacity() {
    const capacity = this.capacity - this.channeled;

    if (capacity < 0) {
      return 0;
    }

    return capacity;
  }

  channel(amount: number) {
    this.channeled += amount;
  }

  undoChannel(amount: number) {
    if (this.channeled - amount < 0) {
      throw new Error("Can not undo channel more than channeled");
    }

    this.channeled = this.channeled - amount;
  }
}

export default ThrustAssignment;
