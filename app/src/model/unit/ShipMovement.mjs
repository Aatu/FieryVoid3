import MovementOrder from "../movement/MovementOrder.mjs";
class ShipMovement {
  constructor(ship) {
    this.ship = ship;
    this.moves = [];
  }

  addMovement(move) {
    this.moves.push(move.clone());
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
    return this.moves[this.moves.length - 1].clone();
  }

  getFirstMove() {
    const end = this.moves.find(move => move.isEnd());

    if (end) {
      return end.clone();
    }

    const deploy = this.moves.find(move => move.isDeploy());

    if (deploy) {
      return deploy.clone();
    }

    const start = this.moves.find(move => move.isStart());

    if (start) {
      return start.clone();
    }

    throw new Error("Ship does not have start move");
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

  getMovementVector() {
    return this.moves.reduce((vector, move) => {
      if (move.isDeploy() || move.isEnd()) {
        return move.target;
      } else if (move.isSpeed()) {
        return vector.add(move.target);
      }

      return vector;
    }, new hexagon.Offset(0, 0));
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
