import MovementOrder from "../movement/MovementOrder.mjs";
import Vector from "../utils/Vector";

class ShipMovement {
  constructor(ship) {
    this.ship = ship;
    this.moves = [];
  }

  addMovement(move) {
    this.moves.push(move.clone());
  }

  removeMovement(move) {
    const toDelete = this.moves.find(other => other.equals(move));
    this.moves = this.moves.filter(other => other !== toDelete);
  }

  getMovement() {
    return this.moves.map(move => move.clone());
  }

  getPlayerAddedMovement() {
    return this.moves
      .filter(move => move.isPlayerAdded())
      .map(move => move.clone());
  }

  getLastMove() {
    if (this.moves.length === 0) {
      return null;
    }

    return this.moves[this.moves.length - 1].clone();
  }

  getStartMove() {
    const start = this.moves.find(move => move.isStart());
    if (!start) {
      return null;
    }

    return start.clone();
  }

  getDeployMove() {
    const deploy = this.moves.find(move => move.isDeploy());
    if (!deploy) {
      return null;
    }

    return deploy.clone();
  }

  replaceDeployMove(newMove) {
    this.moves = this.moves.map(move => {
      if (move.isDeploy()) {
        return newMove;
      } else {
        return move.clone();
      }
    });
  }

  replaceMovement(newMovement) {
    this.moves = [
      ...this.moves.filter(move => !move.isPlayerAdded()),
      ...newMovement.filter(move => move.isPlayerAdded())
    ];

    this.moves = this.moves.map(move => move.clone());
  }

  getLastEndMove() {
    const end = this.moves
      .slice()
      .reverse()
      .find(move => move.isEnd());

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
    const move = this.moves.find(move => move.isEvade());

    if (!move) {
      return null;
    }

    return move.clone();
  }

  getRollMove() {
    const move = this.moves.find(move => move.isRoll());

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

  getMovementVector() {
    return this.moves.reduce((vector, move) => {
      if (move.isDeploy() || move.isEnd() || move.isStart()) {
        return move.velocity;
      } else if (move.isSpeed()) {
        return vector.add(move.velocity);
      }

      return vector;
    }, new Vector(0, 0));
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
      .filter(move => move.requiredThrust)
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
      .filter(system => system.callHandler("isThruster"))
      .filter(system => !system.isDisabled());
  }

  getMaxEvasion() {
    return this.ship.systems
      .getSystems()
      .reduce(
        (acc, system) => system.callHandler("getMaxEvasion", null, acc),
        0
      );
  }

  deserialize(data = []) {
    this.moves = data.map(moveData =>
      new MovementOrder().deserialize(moveData)
    );

    return this;
  }

  serialize() {
    return this.moves.map(move => move.serialize());
  }
}

export default ShipMovement;
