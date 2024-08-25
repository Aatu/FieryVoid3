import Ship from "../unit/Ship";
import { addToHexFacing } from "../utils/math";
import {
  MOVEMENT_TYPE,
  MovementOrder,
  MovementService,
  ThrustBill,
} from "./index";

class MovementResolver {
  public ship: Ship;
  public movementService: MovementService;
  public turn: number;

  constructor(ship: Ship, movementService: MovementService, turn: number) {
    this.ship = ship;
    this.movementService = movementService;
    this.turn = turn;
  }

  billAndPay(bill: ThrustBill, commit = true) {
    if (bill.pay()) {
      const newMovement = bill.getMoves();

      if (commit) {
        this.ship.movement.replaceMovement(newMovement);
        this.movementService.shipStateChanged({ ship: this.ship });
      }

      return true;
    } else if (commit) {
      throw new Error(
        "Tried to commit move that was not legal. Check legality first!"
      );
    } else {
      return false;
    }
  }

  canRoll() {
    return this.roll(false);
  }

  roll(commit = true) {
    let rollMove = this.ship.movement.getRollMove();

    const endMove = this.ship.movement.getLastEndMoveOrSurrogate();

    let movements = this.ship.movement.getMovement();

    if (rollMove) {
      movements = movements.filter((move) => !move.isRoll());
    } else {
      rollMove = new MovementOrder(
        null,
        MOVEMENT_TYPE.ROLL,
        endMove.position,
        endMove.velocity,
        endMove.facing,
        endMove.rolled,
        this.turn,
        endMove.rolled ? false : true
      );

      const playerAdded = movements.filter((move) => move.isPlayerAdded());
      const nonPlayerAdded = movements.filter((move) => !move.isPlayerAdded());

      movements = [...nonPlayerAdded, rollMove, ...playerAdded];
    }

    const bill = new ThrustBill(this.ship, movements);

    return this.billAndPay(bill, commit);
  }

  canEvade(step: number) {
    return this.evade(step, false);
  }

  evade(step: number, commit = true) {
    let evadeMove = this.ship.movement.getEvadeMove();

    const endMove = this.ship.movement.getLastEndMoveOrSurrogate();

    if (evadeMove) {
      if (
        (evadeMove.value as number) + step >
        this.ship.movement.getMaxEvasion()
      ) {
        return false;
      }

      if ((evadeMove.value as number) + step < 0) {
        return false;
      }
      (evadeMove.value as number) += step;
    } else {
      if (step < 0) {
        return false;
      }

      evadeMove = new MovementOrder(
        null,
        MOVEMENT_TYPE.EVADE,
        endMove.position,
        endMove.velocity,
        endMove.facing,
        endMove.rolled,
        this.turn,
        1
      );
    }

    const playerAdded = this.ship.movement
      .getMovement()
      .filter(
        (move) => move.isPlayerAdded() && !move.isRoll() && !move.isEvade()
      );
    const nonPlayerAdded = this.ship.movement
      .getMovement()
      .filter((move) => !move.isPlayerAdded() || move.isRoll());

    const movements =
      evadeMove.value === 0
        ? [...nonPlayerAdded, ...playerAdded]
        : [...nonPlayerAdded, evadeMove, ...playerAdded];

    const bill = new ThrustBill(this.ship, movements);

    return this.billAndPay(bill, commit);
  }

  canPivot(pivotDirection: 1 | -1) {
    return this.pivot(pivotDirection, false);
  }

  pivot(pivotDirection: 1 | -1, commit = true) {
    const lastMove = this.ship.movement.getLastMove();

    const pivotMove = new MovementOrder(
      null,
      MOVEMENT_TYPE.PIVOT,
      lastMove.position,
      lastMove.velocity,
      addToHexFacing(lastMove.facing, pivotDirection),
      lastMove.rolled,
      this.turn,
      pivotDirection
    );

    const movements = this.ship.movement.getMovement();

    if (lastMove.isPivot() && lastMove.value !== pivotDirection) {
      movements.pop();
    } else {
      if (
        this.ship.maxPivots !== null &&
        this.ship.movement.getMovement().filter((move) => move.isPivot())
          .length >= this.ship.maxPivots
      ) {
        return false;
      }

      movements.push(pivotMove);
    }

    const bill = new ThrustBill(this.ship, movements);

    return this.billAndPay(bill, commit);
  }

  canThrust(direction: number) {
    return this.thrust(direction, false);
  }

  thrust(direction: number, commit = true) {
    const lastMove = this.ship.movement.getLastMove();

    const thrustMove = new MovementOrder(
      null,
      MOVEMENT_TYPE.SPEED,
      lastMove.position,
      lastMove.getHexVelocity().moveToDirection(direction),
      lastMove.facing,
      lastMove.rolled,
      this.turn,
      direction
    );

    let movements = this.ship.movement.getMovement();
    if (lastMove.isSpeed() && lastMove.value === addToHexFacing(direction, 3)) {
      movements.pop();
    } else {
      movements.push(thrustMove);
    }

    const bill = new ThrustBill(this.ship, movements);

    return this.billAndPay(bill, commit);
  }

  canCancel() {
    return this.ship.movement
      .getMovement()
      .some((move) => move.isCancellable());
  }

  cancel() {
    const toCancel = this.ship.movement.getLastMove();

    if (!toCancel || !toCancel.isCancellable()) {
      return;
    }

    this.ship.movement.removeMovement(toCancel);

    const bill = new ThrustBill(this.ship, this.ship.movement.getMovement());

    return this.billAndPay(bill, true);
  }

  canRevert() {
    return this.ship.movement
      .getMovement()
      .some((move) => move.isPlayerAdded());
  }

  revert() {
    this.ship.movement
      .getMovement()
      .filter((move) => move.isCancellable())
      .forEach((move) => this.ship.movement.removeMovement(move));

    this.movementService.shipStateChanged({ ship: this.ship });
  }
}

export default MovementResolver;
