import { RequiredThrust, ThrustAssignment } from "./index.mjs";

class ThrustBill {
  constructor(ship, thrustAvailable, movement) {
    this.ship = ship;
    this.movement = movement.map(move => move.clone());
    this.thrusters = ship.systems
      .getSystems()
      .filter(system => system.callHandler("isThruster", null, false))
      .filter(system => !system.isDisabled())
      .map(thruster => new ThrustAssignment(thruster));

    this.buildRequiredThrust(this.movement);

    this.paid = null;

    this.cost = 0;
    this.thrustAvailable = thrustAvailable;
    this.directionsRequired = this.getRequiredThrustDirections();
  }

  getRequiredThrustDirections() {
    const result = this.movement.reduce(
      (accumulator, move) => move.requiredThrust.accumulate(accumulator),
      {}
    );

    result[0] = result[0] || 0;
    result[1] = result[1] || 0;
    result[2] = result[2] || 0;
    result[3] = result[3] || 0;
    result[4] = result[4] || 0;
    result[5] = result[5] || 0;
    result[6] = result[6] || 0;
    result[7] = result[7] || 0;
    result[8] = result[8] || 0;

    return result;
  }

  getTotalThrustRequired() {
    const totalRequired = this.getRequiredThrustDirections();
    return (
      totalRequired[0] +
      totalRequired[1] +
      totalRequired[2] +
      totalRequired[3] +
      totalRequired[4] +
      totalRequired[5] +
      totalRequired[6] +
      totalRequired[7] +
      totalRequired[8]
    );
  }

  getCurrentThrustRequired() {
    return (
      this.directionsRequired[0] +
      this.directionsRequired[1] +
      this.directionsRequired[2] +
      this.directionsRequired[3] +
      this.directionsRequired[4] +
      this.directionsRequired[5] +
      this.directionsRequired[6] +
      this.directionsRequired[7] +
      this.directionsRequired[8]
    );
  }

  isPaid() {
    return this.getCurrentThrustRequired() === 0;
  }

  getAllUsableThrusters(direction) {
    return this.thrusters
      .filter(thruster => {
        const capacity = thruster.getThrustCapacity();

        return thruster.isDirection(direction) && capacity > 0;
      })
      .sort(this.sortThrusters);
  }

  sortThrusters(a, b) {
    const aHeat = a.getOverheat();
    const bHeat = b.getOverheat();

    if (aHeat > bHeat) {
      return -1;
    }

    if (aHeat > bHeat) {
      return 1;
    }

    if (a.channeled > b.channeled) {
      return -1;
    }

    if (a.channeled < b.channeled) {
      return 1;
    }

    return 0;
  }

  errorIfOverBudget() {
    if (this.isOverBudget()) {
      throw new Error("over budget");
    }
  }

  isOverBudget() {
    return this.cost > this.thrustAvailable;
  }

  pay() {
    if (this.paid !== null) {
      throw new Error("Thrust bill is already paid!");
    }

    try {
      if (this.getTotalThrustRequired() > this.thrustAvailable) {
        throw new Error("over budget");
      }

      this.process();

      this.paid = this.isPaid();
      return this.paid;
    } catch (e) {
      if (e.message === "over budget") {
        this.paid = false;
        return this.paid;
      }

      throw e;
    }
  }

  process() {
    Object.keys(this.directionsRequired).forEach(direction => {
      const required = this.directionsRequired[direction];
      direction = parseInt(direction, 10);

      if (required === 0) {
        return;
      }

      this.useThrusters(direction, required);
    });

    return this.isPaid();
  }

  useThrusters(direction, required) {
    let assigned = 0;

    while (true) {
      const thrusters = this.getAllUsableThrusters(direction);

      if (thrusters.length === 0) {
        return;
      }

      if (assigned === required) {
        return;
      }

      const thruster = thrusters.pop();
      thruster.channel(1);
      this.directionsRequired[direction] -= 1;
      this.cost += 1;
      assigned += 1;

      this.errorIfOverBudget();
    }
  }

  buildRequiredThrust(movement) {
    movement.forEach(move =>
      move.setRequiredThrust(new RequiredThrust(this.ship, move))
    );
  }

  getMoves() {
    this.thrusters.forEach(thruster => {
      let channeled = thruster.channeled;
      this.movement.forEach(move => {
        thruster.directions.forEach(direction => {
          if (channeled === 0) {
            return;
          }

          const required = move.requiredThrust.getRequirement(direction);

          if (required === 0) {
            return;
          }

          if (required > channeled) {
            move.requiredThrust.fulfill(
              direction,
              channeled,
              thruster.thruster
            );
            channeled = 0;
          } else {
            move.requiredThrust.fulfill(direction, required, thruster.thruster);
            channeled -= required;
          }
        });
      });
    });

    if (!this.movement.every(move => move.requiredThrust.isFulfilled())) {
      throw new Error("Not all moves are fulfilled");
    }

    return this.movement;
  }
}

export default ThrustBill;
