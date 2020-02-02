class ThrustAssignment {
  constructor(thruster) {
    this.thruster = thruster;

    this.directions = [].concat(thruster.callHandler("getThrustDirection"));
    this.paid = 0;
    this.channeled = 0;
    this.capacity = thruster.callHandler("getThrustChannel");
    this.assigned = 0;
  }

  addAssigned(amount) {
    this.assigned += amount;
  }

  getOverheat() {
    return (
      this.thruster.heat.getOverheat() +
      this.thruster.callHandler(
        "getHeatForThrust",
        { amount: this.channeled },
        0
      )
    );
  }

  isDirection(direction) {
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
