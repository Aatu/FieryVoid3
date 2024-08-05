import { movementTypes } from "./index.mjs";
import { addToHexFacing } from "../utils/math.mjs";

class RequiredThrust {
  constructor(ship, move) {
    this.requirements = {};
    this.fullfilments = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: []
    };

    if (move) {
      switch (move.type) {
        case movementTypes.SPEED:
          this.requireSpeed(ship, move);
          break;
        case movementTypes.PIVOT:
          this.requirePivot(ship, move);
          break;
        case movementTypes.ROLL:
          this.requireRoll(ship);
          break;
        case movementTypes.EVADE:
          this.requireEvade(ship, move);
          break;
        default:
      }
    }
  }

  serialize() {
    return {
      requirements: this.requirements,
      fullfilments: this.fullfilments
    };
  }

  deserialize(data = {}) {
    this.requirements = data.requirements || {};
    this.fullfilments = data.fullfilments || {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: []
    };
    return this;
  }

  getTotalAmountRequired() {
    return Object.keys(this.requirements).reduce((total, direction) => {
      const required = this.requirements[direction] || 0;
      return total + required;
    }, 0);
  }

  getRequirement(direction) {
    if (!this.requirements[direction]) {
      return 0;
    }

    return this.requirements[direction] - this.getFulfilledAmount(direction);
  }

  isFulfilled() {
    return Object.keys(this.requirements).every(
      direction => this.getRequirement(direction) === 0
    );
  }

  fulfill(direction, amount, thruster) {
    this.fullfilments[direction].push({ amount, thrusterId: thruster.id });
    if (this.requirements[direction] < this.getFulfilledAmount(direction)) {
      throw new Error("Fulfilled too much!");
    }
  }

  getFulfilledAmount(direction) {
    return this.fullfilments[direction].reduce(
      (total, entry) => total + entry.amount,
      0
    );
  }

  getFulfilments() {
    return Object.keys(this.fullfilments)
      .map(key => this.fullfilments[key])
      .filter(fulfillment => fulfillment.length > 0);
  }

  requireRoll(ship) {
    this.requirements[8] = ship.rollcost;
  }

  requireEvade(ship, move) {
    this.requirements[8] = ship.evasioncost * move.value;
  }

  requirePivot(ship, move) {
    if (ship.movement.isRolled()) {
      if (move.value === 1) {
        this.requirements[7] = ship.pivotcost;
      } else {
        this.requirements[6] = ship.pivotcost;
      }
    } else {
      if (move.value === 1) {
        this.requirements[6] = ship.pivotcost;
      } else {
        this.requirements[7] = ship.pivotcost;
      }
    }
  }

  requireSpeed(ship, move) {
    const facing = move.facing;
    const direction = move.value;
    const actualDirection = addToHexFacing(
      addToHexFacing(direction, -facing),
      3
    );

    if (ship.movement.isRolled() && [1, 2, 4, 5].includes(actualDirection)) {
      this.requirements[addToHexFacing(actualDirection, 3)] = ship.accelcost;
    } else {
      this.requirements[actualDirection] = ship.accelcost;
    }
  }

  accumulate(total) {
    Object.keys(this.requirements).forEach(direction => {
      total[direction] = total[direction]
        ? total[direction] + this.requirements[direction]
        : this.requirements[direction];
    });

    return total;
  }
}

export default RequiredThrust;
