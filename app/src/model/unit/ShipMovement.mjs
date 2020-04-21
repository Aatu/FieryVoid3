import MovementOrder from "../movement/MovementOrder.mjs";
import Vector from "../utils/Vector.mjs";
import ThrustBill from "../movement/ThrustBill.mjs";

class ShipMovement {
  constructor(ship) {
    this.ship = ship;
    this.moves = [];
  }

  addMovement(move) {
    this.moves.push(move.clone());
    this.buildIndex();
  }

  removeMovement(move) {
    const toDelete = this.moves.find((other) => other.equals(move));
    this.moves = this.moves.filter((other) => other !== toDelete);
    this.buildIndex();
  }

  replaceLastMove(move) {
    this.moves[this.moves.length - 1] = move;
    this.buildIndex();
  }

  removeMovementExceptEnd(turn) {
    this.moves = this.moves.filter(
      (move) =>
        move.turn < turn || move.isEnd() || move.isDeploy() || move.isStart()
    );
    this.buildIndex();
  }

  removeMovementForTurn(turn) {
    this.moves = this.moves.filter(
      (move) => move.turn < turn || move.isStart()
    );
    this.buildIndex();
  }

  removeMovementForOtherTurns(turn) {
    this.moves = this.moves.filter((move) => move.turn === turn);
    this.buildIndex();
  }

  getMovement() {
    return this.moves.map((move) => move.clone());
  }

  getPlayerAddedMovement() {
    return this.moves
      .filter((move) => move.isPlayerAdded())
      .map((move) => move.clone());
  }

  getLastMove() {
    if (this.moves.length === 0) {
      return null;
    }

    return this.moves[this.moves.length - 1].clone();
  }

  getStartMove() {
    const start = this.moves.find((move) => move.isStart());
    if (!start) {
      return null;
    }

    return start.clone();
  }

  getDeployMove() {
    const deploy = this.moves.find((move) => move.isDeploy());
    if (!deploy) {
      return null;
    }

    return deploy.clone();
  }

  replaceDeployMove(newMove) {
    this.moves = this.moves.map((move) => {
      if (move.isDeploy()) {
        return newMove;
      } else {
        return move.clone();
      }
    });
  }

  replaceMovement(newMovement) {
    this.moves = [
      ...this.moves.filter((move) => !move.isPlayerAdded()),
      ...newMovement.filter((move) => move.isPlayerAdded()),
    ];

    this.moves = this.moves.map((move) => move.clone());
    this.buildIndex();
  }

  buildIndex() {
    let lastIndex = null;

    this.moves.forEach((move) => {
      if (
        lastIndex === null &&
        (move.isEnd() || move.isStart() || move.isDeploy()) &&
        move.index !== 0
      ) {
        lastIndex = move.index;
      } else if (lastIndex !== null) {
        lastIndex++;
        move.index = lastIndex;
      }
    });

    this.ship.systems.callAllSystemHandlers("resetChanneledThrust");

    this.moves.forEach((move) => {
      const fulfilments = move.requiredThrust.getFulfilments();
      fulfilments.forEach((fulfilment) => {
        fulfilment.forEach(({ amount, thrusterId }) => {
          this.ship.systems
            .getSystemById(thrusterId)
            .callHandler("addChanneledThrust", amount);
        });
      });
    });
  }

  getLastEndMove() {
    const end = this.moves
      .slice()
      .reverse()
      .find((move) => move.isEnd());

    if (!end) {
      return null;
    }

    return end.clone();
  }

  getLastEndMoveOrSurrogate() {
    const end = this.getLastEndMove();
    if (!end) {
      const deploy = this.getDeployMove();

      if (!deploy) {
        const start = this.getStartMove();
        return start;
      }

      return deploy;
    }

    return end;
  }

  getEvadeMove() {
    const move = this.moves.find((move) => move.isEvade());

    if (!move) {
      return null;
    }

    return move.clone();
  }

  isRolled() {
    const end = this.getLastEndMoveOrSurrogate();
    return end.rolled;
  }

  isRolling() {
    return this.getRollMove();
  }

  getRollMove() {
    const move = this.moves.find((move) => move.isRoll());

    if (!move) {
      return null;
    }

    return move.clone();
  }

  getEvasion() {
    const move = this.getEvadeMove();

    if (!move) {
      return 0;
    }

    return move.value;
  }

  getActiveEvasion() {
    const move = this.getLastEndMoveOrSurrogate();

    if (!move) {
      return 0;
    }

    return move.evasion;
  }

  getThrustOutput() {
    return this.ship.systems
      .getSystems()
      .reduce(
        (acc, system) => system.callHandler("getThrustOutput", null, acc),
        0
      );
  }

  getThrustRequired() {
    return this.moves
      .filter((move) => move.requiredThrust)
      .reduce(
        (total, move) => total + move.requiredThrust.getTotalAmountRequired(),
        0
      );
  }

  getRemainingThrustOutput() {
    return this.getThrustOutput() - this.getThrustRequired();
  }

  getThrusters() {
    return this.ship.systems
      .getSystems()
      .filter((system) => system.callHandler("isThruster"))
      .filter((system) => !system.isDisabled());
  }

  getMaxEvasion() {
    return this.ship.systems
      .getSystems()
      .reduce(
        (acc, system) => system.callHandler("getMaxEvasion", null, acc),
        0
      );
  }

  isOverlapping(otherShip) {
    const shipPosition = this.ship.getHexPosition();
    const shipFacing = this.ship.getFacing();
    const otherShipPosition = otherShip.getHexPosition();
    const otherShipFacing = otherShip.getFacing();

    return this.ship.hexSizes.some((hex) => {
      return otherShip.hexSizes.some((otherHex) =>
        shipPosition
          .add(hex.rotate(shipFacing))
          .equals(otherShipPosition.add(otherHex.rotate(otherShipFacing)))
      );
    });
  }

  hasValidMovement() {
    const bill = new ThrustBill(this.ship, this.getMovement());

    const result = bill.pay();
    return result;
  }

  revertMovementsUntilValidMovement() {
    const canRevert = () =>
      this.getMovement().some((move) => move.isPlayerAdded());

    while (true) {
      if (this.hasValidMovement()) {
        const bill = new ThrustBill(this.ship, this.getMovement());
        bill.pay();
        const newMovement = bill.getMoves();
        this.ship.movement.replaceMovement(newMovement);
        return;
      }

      if (!canRevert()) {
        throw new Error(
          "Ship does not have valid movement, but can not revert either"
        );
      }

      this.removeMovement(
        this.getMovement()
          .filter((move) => move.isCancellable())
          .pop()
      );
    }
  }

  applyRoll() {
    const endMove = this.getLastEndMove();
    const rollMove = this.getRollMove();
    if (rollMove) {
      endMove.rolled = !endMove.rolled;
    }

    this.replaceLastMove(endMove);
  }

  getFuel() {
    return this.ship.systems
      .getSystems()
      .reduce((all, system) => all + system.callHandler("getFuel", null, 0), 0);
  }

  getFuelSpace() {
    return this.ship.systems
      .getSystems()
      .reduce(
        (all, system) => all + system.callHandler("getFuelSpace", null, 0),
        0
      );
  }

  getFuelCost() {
    return this.ship.systems
      .getSystems()
      .reduce(
        (all, system) =>
          all + system.callHandler("getFuelRequirement", null, 0),
        0
      );
  }

  payFuelCost() {
    const shipFuel = this.getFuel();
    const fuelCost = this.getFuelCost();

    let paid = 0;

    if (fuelCost > shipFuel) {
      throw new Error(
        "Unable to pay fuel cost. This should not happen since moves should be validated!:E"
      );
    }

    const payFuel = () => {
      const tank = this.ship.systems
        .getSystems()
        .filter((system) => system.callHandler("getFuel", null, 0) > 0)
        .sort((a, b) => {
          const aFuel = a.callHandler("getFuel", null, 0);
          const bFuel = b.callHandler("getFuel", null, 0);

          if (aFuel > bFuel) {
            return 1;
          }

          if (aFuel < bFuel) {
            return -1;
          }

          return 0;
        })
        .pop();

      if (!tank) {
        throw new Error(
          "Unable to pay fuel cost. This should not happen since moves should be validated!:E"
        );
      }

      tank.callHandler("takeFuel", 1);
    };

    while (paid < fuelCost) {
      payFuel();
      paid++;
    }
  }

  deserialize(data = []) {
    this.moves = data.map((moveData) =>
      new MovementOrder().deserialize(moveData)
    );

    return this;
  }

  serialize() {
    return this.moves.map((move) => move.serialize());
  }
}

export default ShipMovement;
