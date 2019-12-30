import hexagon from "../hexagon/index.mjs";
import { addToHexFacing } from "../utils/math.mjs";

import {
  MovementOrder,
  movementTypes,
  ThrustBill,
  OverChannelResolver
} from "./index.mjs";

class MovementResolver {
  constructor(ship, movementService, turn) {
    this.ship = ship;
    this.movementService = movementService;
    this.turn = turn;
  }

  billAndPay(bill, commit = true) {
    if (bill.pay()) {
      const newMovement = bill.getMoves();

      const initialOverChannel = new OverChannelResolver(
        this.ship.movement.getThrusters(),
        this.ship.movement.getMovement()
      ).getAmountOverChanneled();

      const newOverChannel = new OverChannelResolver(
        this.ship.movement.getThrusters(),
        newMovement
      ).getAmountOverChanneled();

      if (commit) {
        this.ship.movement.replaceMovement(newMovement);
        this.movementService.shipStateChanged(this.ship);
      }
      return {
        result: true,
        overChannel: newOverChannel - initialOverChannel > 0
      };
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
      movements = movements.filter(move => !move.isRoll());
    } else {
      rollMove = new MovementOrder(
        null,
        movementTypes.ROLL,
        endMove.position,
        endMove.velocity,
        endMove.facing,
        endMove.rolled,
        this.turn,
        endMove.rolled ? false : true
      );

      const playerAdded = movements.filter(move => move.isPlayerAdded());
      const nonPlayerAdded = movements.filter(move => !move.isPlayerAdded());

      movements = [...nonPlayerAdded, rollMove, ...playerAdded];
    }

    const bill = new ThrustBill(
      this.ship,
      this.ship.movement.getThrustOutput(),
      movements
    );

    return this.billAndPay(bill, commit);
  }

  canEvade(step) {
    return this.evade(step, false);
  }

  evade(step, commit = true) {
    let evadeMove = this.ship.movement.getEvadeMove();

    const endMove = this.ship.movement.getLastEndMoveOrSurrogate();

    if (evadeMove) {
      if (evadeMove.value + step > this.ship.movement.getMaxEvasion()) {
        return false;
      }

      if (evadeMove.value + step < 0) {
        return false;
      }
      evadeMove.value += step;
    } else {
      if (step < 0) {
        return false;
      }

      evadeMove = new MovementOrder(
        null,
        movementTypes.EVADE,
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
        move => move.isPlayerAdded() && !move.isRoll() && !move.isEvade()
      );
    const nonPlayerAdded = this.ship.movement
      .getMovement()
      .filter(move => !move.isPlayerAdded() || move.isRoll());

    const movements =
      evadeMove.value === 0
        ? [...nonPlayerAdded, ...playerAdded]
        : [...nonPlayerAdded, evadeMove, ...playerAdded];

    const bill = new ThrustBill(
      this.ship,
      this.ship.movement.getThrustOutput(),
      movements
    );

    return this.billAndPay(bill, commit);
  }

  canPivot(pivotDirection) {
    return this.pivot(pivotDirection, false);
  }

  pivot(pivotDirection, commit = true) {
    const lastMove = this.ship.movement.getLastMove();

    const pivotMove = new MovementOrder(
      null,
      movementTypes.PIVOT,
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
      movements.push(pivotMove);
    }

    const bill = new ThrustBill(
      this.ship,
      this.ship.movement.getThrustOutput(),
      movements
    );

    return this.billAndPay(bill, commit);
  }

  canThrust(direction) {
    return this.thrust(direction, false);
  }

  thrust(direction, commit = true) {
    const lastMove = this.ship.movement.getLastMove();

    const thrustMove = new MovementOrder(
      null,
      movementTypes.SPEED,
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

    const bill = new ThrustBill(
      this.ship,
      this.ship.movement.getThrustOutput(),
      movements
    );

    return this.billAndPay(bill, commit);
  }

  canCancel() {
    return this.ship.movement.getMovement().some(move => move.isCancellable());
  }

  cancel() {
    const toCancel = this.ship.movement.getLastMove();

    if (!toCancel || !toCancel.isCancellable()) {
      return;
    }

    this.ship.movement.removeMovement(toCancel);

    const bill = new ThrustBill(
      this.ship,
      this.ship.movement.getThrustOutput(),
      this.ship.movement.getMovement()
    );

    return this.billAndPay(bill, true);
  }

  canRevert() {
    return this.ship.movement.getMovement().some(move => move.isPlayerAdded());
  }

  revert() {
    this.ship.movement
      .getMovement()
      .filter(move => move.isCancellable() || move.isEvade())
      .forEach(move => this.ship.movement.removeMovement(move));

    this.movementService.shipStateChanged(this.ship);
  }
}

export default MovementResolver;
