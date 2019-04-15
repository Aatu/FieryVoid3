import MovementOrder from "../../../model/movement/MovementOrder.mjs";
import movementTypes from "../../../model/movement/movementTypes";
import RequiredThrustValidator from "./RequiredThrustValidator";
import hexagon from "../../../model/hexagon";
import { InvalidGameDataError } from "../../errors";
import { addToHexFacing } from "../../../model/utils/math.mjs";

class MovementValidator {
  constructor(ship, turn, startMove) {
    this.ship = ship;
    this.turn = turn;
    this.startMove = startMove;

    if (!this.startMove || !(startMove instanceof MovementOrder)) {
      throw new InvalidGameDataError(
        "startMove is not defined or not instanceof MovementOrder"
      );
    }

    this.thrusterUse = [];
  }

  validate() {
    const movement = this.ship.movement.getPlayerAddedMovement();
    return (
      this.ensureMovesAreCorrectlyBuilt(this.startMove, movement) &&
      this.ensureMovesAreFullyPaid(movement)
    );
  }

  getNewEndMove() {
    const lastmove = this.ship.movement.getLastMove();
    const vector = this.ship.movement.getMovementVector();
    const rollMove = this.ship.movement.getRollMove();
    const rolled = rollMove ? !this.startMove.rolled : this.startMove.rolled;

    return new MovementOrder(
      null,
      "end",
      this.startMove.position.add(this.startMove.target).add(vector),
      this.startMove.target.add(vector),
      lastmove.facing,
      rolled,
      this.turn
    );
  }

  ensureMovesAreFullyPaid(movement) {
    const thrusters = this.ship.movement.getThrusters();
    let totalChanneled = 0;
    let cost = 0;

    movement.forEach(move => {
      const currentRequiredThrust = move.requiredThrust;
      const validator = new RequiredThrustValidator(this.ship, move);

      validator.ensureThrustersAreValid(currentRequiredThrust);
      validator.validateRequirementsAreCorrect(currentRequiredThrust);
      validator.isPaid(currentRequiredThrust);

      thrusters.forEach(thruster => {
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

        totalChanneled += used;
      });
    });

    Object.keys(this.thrusterUse).forEach(key => {
      const { thruster, amount } = this.thrusterUse[key];

      if (!thruster.callHandler("canChannelAmount", amount)) {
        throw new InvalidGameDataError(
          `Thruster ${thruster.id} can not channel ${amount}`
        );
      }

      cost += thruster.callHandler("getChannelCost", amount);
    });

    const enginePower = this.ship.movement.getThrustOutput();

    if (cost > enginePower) {
      throw new InvalidGameDataError(
        `Insufficient engine power: required ${cost} produced: ${enginePower}`
      );
    }

    return true;
  }

  ensureMovesAreCorrectlyBuilt(start, movement) {
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
        case movementTypes.SPEED:
          this.constructSpeed(lastMove, move);
          break;
        case movementTypes.PIVOT:
          this.constructPivot(lastMove, move);
          break;
        case movementTypes.EVADE:
          this.constructEvade(start, move);
          break;
        case movementTypes.ROLL:
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

  constructSpeed(last, move) {
    if (move.value < 0 || move.value > 5) {
      throw new InvalidGameDataError("Speed movement value is out of bounds");
    }

    const test = last.clone();
    test.target = new hexagon.Offset(0, 0).moveToDirection(move.value);
    test.type = movementTypes.SPEED;
    test.value = move.value;
    test.turn = this.turn;

    if (!test.equals(move)) {
      throw new InvalidGameDataError("Speed movement is constructed wrong");
    }
  }

  constructPivot(last, move) {
    if (move.value !== -1 && move.value !== 1) {
      throw new InvalidGameDataError("Pivot movement value is out of bounds");
    }

    const test = last.clone();
    test.target = new hexagon.Offset(0, 0);
    test.type = movementTypes.PIVOT;
    test.facing = addToHexFacing(test.facing, move.value);
    test.value = move.value;
    test.turn = this.turn;

    if (!test.equals(move)) {
      throw new InvalidGameDataError("Pivot movement is constructed wrong");
    }
  }

  constructEvade(last, move) {
    if (move.value < 1 || move.value > this.ship.movement.getMaxEvasion()) {
      throw new InvalidGameDataError("Evade movement value is out of bounds");
    }

    const test = last.clone();
    test.target = new hexagon.Offset(0, 0);
    test.type = movementTypes.EVADE;
    test.value = move.value;
    test.turn = this.turn;

    if (!test.equals(move)) {
      throw new InvalidGameDataError("Evade movement is constructed wrong");
    }
  }

  constructRoll(last, move) {
    if (move.value !== true && move.value !== false) {
      throw new InvalidGameDataError(
        `Roll movement value is out of bounds. Expected true or false, got'${
          move.value
        }'`
      );
    }

    const test = last.clone();
    test.target = new hexagon.Offset(0, 0);
    test.type = movementTypes.ROLL;
    test.value = !last.rolled;
    test.turn = this.turn;

    if (!test.equals(move)) {
      throw new InvalidGameDataError("Roll movement is constructed wrong");
    }
  }
}

export default MovementValidator;
