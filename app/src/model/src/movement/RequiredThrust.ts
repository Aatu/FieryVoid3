import Ship from "../unit/Ship";
import ShipSystem from "../unit/system/ShipSystem";
import { THRUSTER_DIRECTION } from "../unit/system/strategy/ThrustChannelSystemStrategy";
import { addToHexFacing } from "../utils/math";
import MovementOrder from "./MovementOrder";
import { MOVEMENT_TYPE } from "./movementTypes";

type ThrustFulfilment = { amount: number; thrusterId: number };

type ThrustFulfilments = {
  [THRUSTER_DIRECTION.FORWARD]: ThrustFulfilment[];
  [THRUSTER_DIRECTION.STARBOARD_FORWARD]: ThrustFulfilment[];
  [THRUSTER_DIRECTION.STARBOARD_AFT]: ThrustFulfilment[];
  [THRUSTER_DIRECTION.AFT]: ThrustFulfilment[];
  [THRUSTER_DIRECTION.PORT_FORWARD]: ThrustFulfilment[];
  [THRUSTER_DIRECTION.PORT_AFT]: ThrustFulfilment[];
  [THRUSTER_DIRECTION.PIVOT_RIGHT]: ThrustFulfilment[];
  [THRUSTER_DIRECTION.PIVOT_LEFT]: ThrustFulfilment[];
  [THRUSTER_DIRECTION.MANOUVER]: ThrustFulfilment[];
};

export type SerializedRequiredThrust = {
  requirements?: Record<number, number>;
  fullfilments?: ThrustFulfilments;
};

class RequiredThrust {
  public requirements: Record<number, number>;
  public fullfilments: ThrustFulfilments;

  constructor() {
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
      8: [],
    };
  }

  calculate(ship: Ship, move: MovementOrder) {
    if (move) {
      switch (move.type) {
        case MOVEMENT_TYPE.SPEED:
          this.requireSpeed(ship, move);
          break;
        case MOVEMENT_TYPE.PIVOT:
          this.requirePivot(ship, move);
          break;
        case MOVEMENT_TYPE.ROLL:
          this.requireRoll(ship);
          break;
        case MOVEMENT_TYPE.EVADE:
          this.requireEvade(ship, move);
          break;
        default:
      }
    }

    return this;
  }

  serialize(): SerializedRequiredThrust {
    return {
      requirements: this.requirements,
      fullfilments: this.fullfilments,
    };
  }

  deserialize(data: SerializedRequiredThrust = {}) {
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
      8: [],
    };
    return this;
  }

  getTotalAmountRequired() {
    return Object.keys(this.requirements).reduce((total, direction) => {
      const required = this.requirements[parseInt(direction, 10)] || 0;
      return total + required;
    }, 0);
  }

  getRequirement(direction: THRUSTER_DIRECTION) {
    if (!this.requirements[direction]) {
      return 0;
    }

    return this.requirements[direction] - this.getFulfilledAmount(direction);
  }

  isFulfilled() {
    return Object.keys(this.requirements).every(
      (direction) =>
        this.getRequirement(parseInt(direction, 10) as THRUSTER_DIRECTION) === 0
    );
  }

  fulfill(direction: THRUSTER_DIRECTION, amount: number, thruster: ShipSystem) {
    this.fullfilments[direction].push({ amount, thrusterId: thruster.id });
    if (this.requirements[direction] < this.getFulfilledAmount(direction)) {
      throw new Error("Fulfilled too much!");
    }
  }

  getFulfilledAmount(direction: THRUSTER_DIRECTION) {
    return this.fullfilments[direction].reduce(
      (total, entry) => total + entry.amount,
      0
    );
  }

  getFulfilments() {
    return Object.keys(this.fullfilments)
      .map((key) => this.fullfilments[parseInt(key, 10) as THRUSTER_DIRECTION])
      .filter((fulfillment) => fulfillment.length > 0);
  }

  requireRoll(ship: Ship) {
    this.requirements[8] = ship.rollcost;
  }

  requireEvade(ship: Ship, move: MovementOrder) {
    this.requirements[8] = ship.evasioncost * (move.value as number);
  }

  requirePivot(ship: Ship, move: MovementOrder) {
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

  requireSpeed(ship: Ship, move: MovementOrder) {
    const facing = move.facing;
    const direction = move.value;
    const actualDirection = addToHexFacing(
      addToHexFacing(direction as number, -facing),
      3
    );

    if (ship.movement.isRolled() && [1, 2, 4, 5].includes(actualDirection)) {
      this.requirements[addToHexFacing(actualDirection, 3)] = ship.accelcost;
    } else {
      this.requirements[actualDirection] = ship.accelcost;
    }
  }

  accumulate(total: ThrustRequirementSummary) {
    Object.keys(THRUSTER_DIRECTION).forEach((directionString: string) => {
      const direction = parseInt(directionString, 10) as THRUSTER_DIRECTION;
      total[direction] = total[direction]
        ? total[direction] + this.requirements[direction]
        : this.requirements[direction];
    });

    return total;
  }
}

export type ThrustRequirementSummary = {
  [THRUSTER_DIRECTION.FORWARD]: number;
  [THRUSTER_DIRECTION.STARBOARD_FORWARD]: number;
  [THRUSTER_DIRECTION.STARBOARD_AFT]: number;
  [THRUSTER_DIRECTION.AFT]: number;
  [THRUSTER_DIRECTION.PORT_FORWARD]: number;
  [THRUSTER_DIRECTION.PORT_AFT]: number;
  [THRUSTER_DIRECTION.PIVOT_RIGHT]: number;
  [THRUSTER_DIRECTION.PIVOT_LEFT]: number;
  [THRUSTER_DIRECTION.MANOUVER]: number;
};

export default RequiredThrust;
