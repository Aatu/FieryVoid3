import MovementOrder, {
  SerializedMovementOrder,
} from "../movement/MovementOrder";
import ThrustBill from "../movement/ThrustBill";
import Ship from "./Ship";
import { SYSTEM_HANDLERS } from "./system/strategy/types/SystemHandlersTypes";

class ShipMovement {
  private ship: Ship;
  private moves: MovementOrder[];

  constructor(ship: Ship) {
    this.ship = ship;
    this.moves = [];
  }

  addMovement(move: MovementOrder) {
    this.moves.push(move.clone());
    this.buildIndex();
  }

  removeMovement(move: MovementOrder) {
    const toDelete = this.moves.find((other) => other.equals(move));
    this.moves = this.moves.filter((other) => other !== toDelete);
    this.buildIndex();
  }

  replaceLastMove(move: MovementOrder) {
    this.moves[this.moves.length - 1] = move;
    this.buildIndex();
  }

  removeMovementExceptEnd(turn: number) {
    this.moves = this.moves.filter(
      (move) =>
        move.turn < turn || move.isEnd() || move.isDeploy() || move.isStart()
    );
    this.buildIndex();
  }

  removeMovementForTurn(turn: number) {
    this.moves = this.moves.filter(
      (move) => move.turn < turn || move.isStart()
    );
    this.buildIndex();
  }

  removeMovementForOtherTurns(turn: number) {
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

  getLastMove(): MovementOrder {
    if (this.moves.length === 0) {
      throw new Error("No moves found");
    }

    return this.moves[this.moves.length - 1].clone();
  }

  getStartMove(): MovementOrder {
    const start = this.moves.find((move) => move.isStart());
    if (!start) {
      throw new Error("There should always be a start move");
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

  replaceDeployMove(newMove: MovementOrder) {
    this.moves = this.moves.map((move) => {
      if (move.isDeploy()) {
        return newMove;
      } else {
        return move.clone();
      }
    });
  }

  replaceMovement(newMovement: MovementOrder[]) {
    this.moves = [
      ...this.moves.filter((move) => !move.isPlayerAdded()),
      ...newMovement.filter((move) => move.isPlayerAdded()),
    ];

    this.moves = this.moves.map((move) => move.clone());
    this.buildIndex();
  }

  buildIndex() {
    let lastIndex: number | null = null;

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

    this.ship.systems.callAllSystemHandlers(
      SYSTEM_HANDLERS.resetChanneledThrust,
      undefined
    );

    this.moves.forEach((move) => {
      const fulfilments = move.requiredThrust.getFulfilments();
      fulfilments.forEach((fulfilment) => {
        fulfilment.forEach(({ amount, thrusterId }) => {
          this.ship.systems
            .getSystemById(thrusterId)
            .callHandler(SYSTEM_HANDLERS.addChanneledThrust, amount, undefined);
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

  getLastEndMoveOrSurrogate(): MovementOrder {
    const end = this.getLastEndMove();
    if (!end) {
      const deploy = this.getDeployMove();

      if (!deploy) {
        const start = this.getStartMove();
        if (!start) {
          throw new Error("No start move found");
        }
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
    return end?.rolled || false;
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

  getEvasion(): number {
    const move = this.getEvadeMove();

    if (!move) {
      return 0;
    }

    return move.value as number;
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
        (acc, system) =>
          system.callHandler(SYSTEM_HANDLERS.getThrustOutput, null, acc),
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
      .filter((system) =>
        system.callHandler(SYSTEM_HANDLERS.isThruster, undefined, false)
      )
      .filter((system) => !system.isDisabled());
  }

  getMaxEvasion() {
    return this.ship.systems
      .getSystems()
      .reduce(
        (acc, system) =>
          system.callHandler(SYSTEM_HANDLERS.getMaxEvasion, null, acc),
        0
      );
  }

  isOverlapping(otherShip: Ship) {
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

      const moveToDelete = this.getMovement()
        .filter((move) => move.isCancellable())
        .pop();

      if (moveToDelete) {
        this.removeMovement(moveToDelete);
      }
    }
  }

  applyRoll() {
    const endMove = this.getLastEndMove();

    if (!endMove) {
      return;
    }

    const rollMove = this.getRollMove();
    if (rollMove) {
      endMove.rolled = !endMove.rolled;
    }

    this.replaceLastMove(endMove);
  }

  getFuel() {
    return this.ship.systems
      .getSystems()
      .reduce(
        (all, system) =>
          all + system.callHandler(SYSTEM_HANDLERS.getFuel, null, 0),
        0
      );
  }

  getFuelSpace() {
    return this.ship.systems
      .getSystems()
      .reduce(
        (all, system) =>
          all + system.callHandler(SYSTEM_HANDLERS.getFuelSpace, null, 0),
        0
      );
  }

  getFuelCost() {
    return this.ship.systems
      .getSystems()
      .reduce(
        (all, system) =>
          all + system.callHandler(SYSTEM_HANDLERS.getFuelRequirement, null, 0),
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
        .filter(
          (system) => system.callHandler(SYSTEM_HANDLERS.getFuel, null, 0) > 0
        )
        .sort((a, b) => {
          const aFuel = a.callHandler(SYSTEM_HANDLERS.getFuel, null, 0);
          const bFuel = b.callHandler(SYSTEM_HANDLERS.getFuel, null, 0);

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

      tank.callHandler(SYSTEM_HANDLERS.takeFuel, 1, undefined);
    };

    while (paid < fuelCost) {
      payFuel();
      paid++;
    }
  }

  deserialize(data: SerializedMovementOrder[] = []) {
    this.moves = data.map((moveData) => MovementOrder.fromData(moveData));
    return this;
  }

  serialize() {
    return this.moves.map((move) => move.serialize());
  }
}

export default ShipMovement;
