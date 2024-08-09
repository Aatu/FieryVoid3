import { MOVEMENT_TYPE } from "../../../model/src/movement";
import MovementOrder from "../../../model/src/movement/MovementOrder";
import Ship from "../../../model/src/unit/Ship";
import { THRUSTER_DIRECTION } from "../../../model/src/unit/system/strategy/ThrustChannelSystemStrategy";
import { addToHexFacing } from "../../../model/src/utils/math";
import InvalidGameDataError from "../../errors/InvalidGameDataError";
import RequiredThrustValidator from "./RequiredThrustValidator";

class MovementValidator {
  private ship: Ship;
  private turn: number;
  private startMove: MovementOrder;
  private thrusterUse: Record<number, { amount: number; thruster: any }>;

  constructor(ship: Ship, turn: number, startMove?: MovementOrder) {
    if (!startMove || !(startMove instanceof MovementOrder)) {
      throw new InvalidGameDataError(
        "startMove is not defined or not instanceof MovementOrder"
      );
    }

    this.ship = ship;
    this.turn = turn;
    this.startMove = startMove;

    this.thrusterUse = [];
  }

  validate() {
    const movement = this.ship.movement.getPlayerAddedMovement();
    return (
      this.ensureMovesAreCorrectlyBuilt(this.startMove, movement) &&
      this.ensureMovesAreFullyPaid(movement) &&
      this.ensurePivotLimit(movement)
    );
  }

  ensurePivotLimit(movement: MovementOrder[]) {
    if (
      this.ship.maxPivots !== null &&
      movement.filter((move) => move.isPivot()).length > this.ship.maxPivots
    ) {
      throw new Error("Ship has pivoted more than allowed");
    }

    return true;
  }

  ensureMovesAreFullyPaid(movement: MovementOrder[]) {
    const thrusters = this.ship.movement.getThrusters();
    let fuelCost = 0;

    movement.forEach((move) => {
      const currentRequiredThrust = move.requiredThrust;
      const validator = new RequiredThrustValidator(this.ship, move);

      validator.ensureThrustersAreValid(currentRequiredThrust);
      validator.validateRequirementsAreCorrect(currentRequiredThrust);
      validator.isPaid(currentRequiredThrust);

      thrusters.forEach((thruster) => {
        const used = validator.getThrustChanneledBy(
          thruster,
          currentRequiredThrust
        );
        if (used === 0) {
          return;
        }

        if (!this.thrusterUse[thruster.id]) {
          this.thrusterUse[thruster.id] = { amount: used, thruster };
        } else {
          this.thrusterUse[thruster.id].amount += used;
        }
      });
    });

    Object.keys(this.thrusterUse).forEach((key) => {
      const direction = parseInt(key, 10) as THRUSTER_DIRECTION;
      const { thruster, amount } = this.thrusterUse[direction];

      if (!thruster.callHandler("canChannelAmount", amount)) {
        throw new InvalidGameDataError(
          `Thruster ${thruster.id} can not channel ${amount}`
        );
      }

      fuelCost += thruster.callHandler("getFuelRequirement", amount, 0);
    });

    const shipFuel = this.ship.movement.getFuel();
    if (shipFuel < fuelCost) {
      throw new InvalidGameDataError(
        `Unable to pay fuel ${fuelCost}. Ship has fuel ${shipFuel}.`
      );
    }

    return true;
  }

  ensureMovesAreCorrectlyBuilt(
    start: MovementOrder,
    movement: MovementOrder[]
  ) {
    let lastMove = start;
    let hasRoll = false;

    movement.forEach((move, index) => {
      if (move.isRoll() && index !== 0) {
        throw new InvalidGameDataError(
          "Roll movement is allowed only as the first move of turn"
        );
      } else if (move.isRoll()) {
        hasRoll = true;
      }

      if (
        (move.isEvade() && hasRoll && index !== 1) ||
        (move.isEvade() && !hasRoll && index !== 0)
      ) {
        throw new InvalidGameDataError(
          "Evade movement is allowed only in the beginnig of moves"
        );
      }

      switch (move.type) {
        case MOVEMENT_TYPE.SPEED:
          this.constructSpeed(lastMove, move);
          break;
        case MOVEMENT_TYPE.PIVOT:
          this.constructPivot(lastMove, move);
          break;
        case MOVEMENT_TYPE.EVADE:
          this.constructEvade(start, move);
          break;
        case MOVEMENT_TYPE.ROLL:
          this.constructRoll(start, move);
          break;
        default:
          throw new InvalidGameDataError(
            `Found unrecognized movement type '${move.type}'`
          );
      }

      lastMove = move;
    });

    return true;
  }

  constructSpeed(last: MovementOrder, move: MovementOrder) {
    const value = move.value as number;
    if (value < 0 || value > 5) {
      throw new InvalidGameDataError("Speed movement value is out of bounds");
    }

    const test = last.clone();
    test.setVelocity(last.getHexVelocity().moveToDirection(value));
    test.type = MOVEMENT_TYPE.SPEED;
    test.value = move.value;
    test.turn = this.turn;

    if (!test.equals(move)) {
      throw new InvalidGameDataError("Speed movement is constructed wrong");
    }
  }

  constructPivot(last: MovementOrder, move: MovementOrder) {
    if (move.value !== -1 && move.value !== 1) {
      throw new InvalidGameDataError("Pivot movement value is out of bounds");
    }

    const test = last.clone();
    test.type = MOVEMENT_TYPE.PIVOT;
    test.facing = addToHexFacing(test.facing, move.value);
    test.value = move.value;
    test.turn = this.turn;

    if (!test.equals(move)) {
      throw new InvalidGameDataError("Pivot movement is constructed wrong");
    }
  }

  constructEvade(last: MovementOrder, move: MovementOrder) {
    const value = move.value as number;
    if (value < 1 || value > this.ship.movement.getMaxEvasion()) {
      throw new InvalidGameDataError("Evade movement value is out of bounds");
    }

    const test = last.clone();
    test.type = MOVEMENT_TYPE.EVADE;
    test.value = move.value;
    test.turn = this.turn;

    if (!test.equals(move)) {
      throw new InvalidGameDataError("Evade movement is constructed wrong");
    }
  }

  constructRoll(last: MovementOrder, move: MovementOrder) {
    if (move.value !== true && move.value !== false) {
      throw new InvalidGameDataError(
        `Roll movement value is out of bounds. Expected true or false, got'${move.value}'`
      );
    }

    const test = last.clone();
    test.type = MOVEMENT_TYPE.ROLL;
    test.value = !last.rolled;
    test.turn = this.turn;

    if (!test.equals(move)) {
      throw new InvalidGameDataError("Roll movement is constructed wrong");
    }
  }
}

export default MovementValidator;
