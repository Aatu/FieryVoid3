import {
  MovementOrder,
  movementTypes,
  MovementResolver,
  OverChannelResolver
} from "./index.mjs";
import hexagon from "../hexagon/index.mjs";
import { addToHexFacing } from "../utils/math.mjs";

class MovementService {
  constructor() {
    this.gamedata = null;
  }

  update(gamedata, phaseDirector) {
    this.gamedata = gamedata;
    this.phaseDirector = phaseDirector;

    return this;
  }

  isMoved(ship, turn) {
    const end = this.getLastEndMove(ship);

    if (!end) {
      return false;
    }

    return end.turn === turn;
  }

  getShipsInSameHex(ship, hex) {
    hex = hex && this.getMostRecentMove(ship).position;
    return this.gamedata.ships.filter(
      ship2 =>
        ship2.isDestroyed() &&
        ship !== ship2 &&
        this.getMostRecentMove(ship2).position.equals(hex)
    );
  }

  getNewEndMove(ship, terrain) {
    const startMove = ship.movement.getLastEndMoveOrSurrogate();
    const lastMove = ship.movement.getLastMove();
    const vector = ship.movement.getMovementVector();
    const rollMove = ship.movement.getRollMove();
    const rolled = rollMove ? !startMove.rolled : startMove.rolled;

    const { position, velocity } = terrain.getGravityVectorForTurn(
      startMove.position,
      vector
    );

    return new MovementOrder(
      null,
      movementTypes.END,
      position,
      velocity,
      lastMove.facing,
      rolled,
      startMove.turn + 1,
      0
    );
  }

  deploy(ship, pos) {
    let deployMove = ship.movement.getDeployMove();

    if (!deployMove) {
      const lastMove = ship.movement.getLastMove();
      deployMove = new MovementOrder(
        -1,
        movementTypes.DEPLOY,
        pos,
        lastMove.velocity,
        lastMove.facing,
        lastMove.rolled,
        this.gamedata.turn,
        0,
        null,
        1
      );
      ship.movement.addMovement(deployMove);
    } else {
      deployMove.setPosition(pos);
      ship.movement.replaceDeployMove(deployMove);
    }
  }

  doDeploymentTurn(ship, step) {
    const deployMove = ship.movement.getDeployMove();
    const newfacing = addToHexFacing(deployMove.facing, step);
    deployMove.facing = newfacing;
    ship.movement.replaceDeployMove(deployMove);
    this.shipStateChanged(ship);
  }

  getOverChannel(ship) {
    return new OverChannelResolver(
      ship.movement.getThrusters(),
      ship.movement.getMovement()
    ).getAmountOverChanneled();
  }

  getPositionAtStartOfTurn(ship, currentTurn) {
    if (currentTurn === undefined) {
      currentTurn = this.gamedata.turn;
    }

    let move = null;

    for (var i = ship.movement.length - 1; i >= 0; i--) {
      move = ship.movement[i];
      if (move.turn < currentTurn) {
        break;
      }
    }

    return new hexagon.Offset(move.position);
  }

  shipStateChanged(ship) {
    this.phaseDirector.relayEvent("shipStateChanged", ship);
  }

  canThrust(ship, direction) {
    return new MovementResolver(ship, this, this.gamedata.turn).canThrust(
      direction
    );
  }

  thrust(ship, direction) {
    new MovementResolver(ship, this, this.gamedata.turn).thrust(direction);
  }

  canCancel(ship) {
    return new MovementResolver(ship, this, this.gamedata.turn).canCancel();
  }

  canRevert(ship) {
    return new MovementResolver(ship, this, this.gamedata.turn).canRevert();
  }

  cancel(ship) {
    new MovementResolver(ship, this, this.gamedata.turn).cancel();
  }

  revert(ship) {
    new MovementResolver(ship, this, this.gamedata.turn).revert();
  }

  canPivot(ship, turnDirection) {
    if (turnDirection !== 1 && turnDirection !== -1) {
      throw new Error("While pivoting direction must be 1 or -1");
    }

    return new MovementResolver(ship, this, this.gamedata.turn).canPivot(
      turnDirection
    );
  }

  pivot(ship, turnDirection) {
    if (turnDirection !== 1 && turnDirection !== -1) {
      throw new Error("While pivoting direction must be 1 or -1");
    }

    return new MovementResolver(ship, this, this.gamedata.turn).pivot(
      turnDirection
    );
  }

  canRoll(ship) {
    return new MovementResolver(ship, this, this.gamedata.turn).canRoll();
  }

  roll(ship) {
    return new MovementResolver(ship, this, this.gamedata.turn).roll();
  }

  canEvade(ship, step) {
    if (step !== 1 && step !== -1) {
      throw new Error("While evading step must be 1 or -1");
    }

    return new MovementResolver(ship, this, this.gamedata.turn).canEvade(step);
  }

  evade(ship, step) {
    if (step !== 1 && step !== -1) {
      throw new Error("While evading step must be 1 or -1");
    }

    return new MovementResolver(ship, this, this.gamedata.turn).evade(step);
  }
}

export default MovementService;
