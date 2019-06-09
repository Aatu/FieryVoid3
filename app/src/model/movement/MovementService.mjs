import { MovementOrder } from ".";
import { movementTypes } from ".";
import { MovementResolver } from ".";
import { OverChannelResolver } from ".";
import hexagon from "../hexagon";
import { addToHexFacing } from "../utils/math";

class MovementService {
  constructor() {
    this.gamedata = null;
  }

  update(gamedata, phaseStrategy) {
    this.gamedata = gamedata;
    this.phaseStrategy = phaseStrategy;

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

  getNewEndMove(ship, terrain, coordinateConverter) {
    const startMove = ship.movement.getLastEndMoveOrSurrogate();
    const lastMove = ship.movement.getLastMove();
    const vector = ship.movement.getMovementVector();
    const rollMove = ship.movement.getRollMove();
    const rolled = rollMove ? !startMove.rolled : startMove.rolled;

    const positionInGame = coordinateConverter
      .fromHexToGame(startMove.position)
      .add(lastMove.positionOffset);

    const vectorInGame = coordinateConverter
      .fromHexToGame(vector)
      .add(lastMove.targetOffset);

    const {
      newPositionHex,
      newTargetHex,
      newPositionOffset,
      newTargetOffset
    } = this.applyOffset(
      positionInGame,
      vectorInGame,
      terrain,
      coordinateConverter
    );

    return new MovementOrder(
      null,
      movementTypes.END,
      newPositionHex,
      newTargetHex,
      lastMove.facing,
      rolled,
      startMove.turn + 1,
      0,
      newPositionOffset,
      newTargetOffset
    );
  }

  applyOffset(positionInGame, vectorInGame, terrain, coordinateConverter) {
    const { velocity: gravityVector } = terrain.getGravityVectorForTurn(
      positionInGame,
      positionInGame.clone().add(vectorInGame)
    );

    const vectorInGameWithGravity = vectorInGame.clone().add(gravityVector);

    const newPosition = positionInGame.clone().add(vectorInGameWithGravity);
    const newPositionHex = coordinateConverter.fromGameToHex(newPosition);

    const newPositionOffset = newPosition
      .clone()
      .sub(coordinateConverter.fromHexToGame(newPositionHex));

    const newTargetHex = coordinateConverter.fromGameToHex(
      vectorInGameWithGravity
    );
    const newTargetOffset = vectorInGameWithGravity
      .clone()
      .sub(coordinateConverter.fromHexToGame(newTargetHex));

    return {
      newPositionHex,
      newTargetHex,
      newPositionOffset,
      newTargetOffset
    };
  }

  deploy(ship, pos) {
    let deployMove = ship.movement.getDeployMove();

    if (!deployMove) {
      const lastMove = ship.movement.getLastMove();
      deployMove = new MovementOrder(
        -1,
        movementTypes.DEPLOY,
        pos,
        lastMove.target,
        lastMove.facing,
        lastMove.rolled,
        this.gamedata.turn
      );
      ship.movement.addMovement(deployMove);
    } else {
      deployMove.position = pos;
      ship.movement.replaceDeployMove(deployMove);
    }
  }

  doDeploymentTurn(ship, right) {
    var step = 1;
    if (!right) {
      step = -1;
    }

    const deployMove = this.getDeployMove(ship);
    const newfacing = addToHexFacing(deployMove.facing, step);
    deployMove.facing = newfacing;
  }

  getEvasion(ship) {
    const evadeMove = this.getEvadeMove(ship);
    return evadeMove ? evadeMove.value : 0;
  }

  getOverChannel(ship) {
    return new OverChannelResolver(
      this.getThrusters(ship),
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

  shipMovementChanged(ship) {
    this.phaseStrategy.onShipMovementChanged({ ship });
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
