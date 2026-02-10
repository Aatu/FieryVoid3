import { THRUSTER_DIRECTION } from "../unit/system/strategy/ThrustChannelSystemStrategy";
import { SYSTEM_HANDLERS } from "../unit/system/strategy/types/SystemHandlersTypes";
class ThrustAssignment {
    thruster;
    directions;
    paid;
    channeled;
    capacity;
    assigned;
    constructor(thruster) {
        this.thruster = thruster;
        this.directions = [].concat(thruster.callHandler(SYSTEM_HANDLERS.getThrustDirection, undefined, THRUSTER_DIRECTION.FORWARD));
        this.paid = 0;
        this.channeled = 0;
        this.capacity = thruster.callHandler(SYSTEM_HANDLERS.getThrustOutput, null, 0);
        this.assigned = 0;
    }
    addAssigned(amount) {
        this.assigned += amount;
    }
    getOverheat() {
        const oldChannel = this.thruster.callHandler(SYSTEM_HANDLERS.getChanneledThrust, null, 0);
        this.thruster.callHandler(SYSTEM_HANDLERS.setChanneledThrust, this.channeled, undefined);
        const payload = this.thruster.heat.predictHeatChange();
        this.thruster.callHandler(SYSTEM_HANDLERS.setChanneledThrust, oldChannel, undefined);
        return payload;
    }
    getFuelRequirement() {
        return this.thruster.callHandler(SYSTEM_HANDLERS.getFuelRequirement, this.channeled, 0);
    }
    getNextThrustFuelCost() {
        return (this.thruster.callHandler(SYSTEM_HANDLERS.getFuelRequirement, this.channeled + 1, 0) -
            this.thruster.callHandler(SYSTEM_HANDLERS.getFuelRequirement, this.channeled, 0));
    }
    isThrustDirection(direction) {
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
    channel(amount) {
        this.channeled += amount;
    }
    undoChannel(amount) {
        if (this.channeled - amount < 0) {
            throw new Error("Can not undo channel more than channeled");
        }
        this.channeled = this.channeled - amount;
    }
}
export default ThrustAssignment;
