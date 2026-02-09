import { THRUSTER_DIRECTION } from "../unit/system/strategy/ThrustChannelSystemStrategy";
import { addToHexFacing } from "../utils/math";
class RequiredThrust {
    requirements;
    fullfilments;
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
    calculate(ship, move) {
        if (move) {
            switch (move.type) {
                case "speed" /* MOVEMENT_TYPE.SPEED */:
                    this.requireSpeed(ship, move);
                    break;
                case "pivot" /* MOVEMENT_TYPE.PIVOT */:
                    this.requirePivot(ship, move);
                    break;
                case "roll" /* MOVEMENT_TYPE.ROLL */:
                    this.requireRoll(ship);
                    break;
                case "evade" /* MOVEMENT_TYPE.EVADE */:
                    this.requireEvade(ship, move);
                    break;
                case "start" /* MOVEMENT_TYPE.START */:
                case "end" /* MOVEMENT_TYPE.END */:
                case "deploy" /* MOVEMENT_TYPE.DEPLOY */:
                    return this;
                default:
                    throw new Error(`Unknown movement type "${move.type}"`);
            }
        }
        return this;
    }
    serialize() {
        return {
            requirements: this.requirements,
            fullfilments: this.fullfilments,
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
    getRequirement(direction) {
        if (!this.requirements[direction]) {
            return 0;
        }
        return this.requirements[direction] - this.getFulfilledAmount(direction);
    }
    isFulfilled() {
        return Object.keys(this.requirements).every((direction) => this.getRequirement(parseInt(direction, 10)) === 0);
    }
    fulfill(direction, amount, thruster) {
        this.fullfilments[direction].push({ amount, thrusterId: thruster.id });
        if (this.requirements[direction] < this.getFulfilledAmount(direction)) {
            throw new Error("Fulfilled too much!");
        }
    }
    getFulfilledAmount(direction) {
        return this.fullfilments[direction].reduce((total, entry) => total + entry.amount, 0);
    }
    getFulfilments() {
        return Object.keys(this.fullfilments)
            .map((key) => this.fullfilments[parseInt(key, 10)])
            .filter((fulfillment) => fulfillment.length > 0);
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
            }
            else {
                this.requirements[6] = ship.pivotcost;
            }
        }
        else {
            if (move.value === 1) {
                this.requirements[6] = ship.pivotcost;
            }
            else {
                this.requirements[7] = ship.pivotcost;
            }
        }
    }
    requireSpeed(ship, move) {
        const facing = move.facing;
        const direction = move.value;
        const actualDirection = addToHexFacing(addToHexFacing(direction, -facing), 3);
        if (ship.movement.isRolled() && [1, 2, 4, 5].includes(actualDirection)) {
            this.requirements[addToHexFacing(actualDirection, 3)] = ship.accelcost;
        }
        else {
            this.requirements[actualDirection] = ship.accelcost;
        }
    }
    accumulate(total) {
        Object.keys(THRUSTER_DIRECTION).forEach((directionString) => {
            const direction = parseInt(directionString, 10);
            if (isNaN(direction)) {
                return;
            }
            const requirement = this.requirements[direction];
            if (isNaN(requirement)) {
                return;
            }
            total[direction] += requirement;
        });
        return total;
    }
}
export default RequiredThrust;
