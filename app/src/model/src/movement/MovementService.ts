import { MOVEMENT_TYPE, MovementOrder, MovementResolver } from "./index.js";

import { addToHexFacing } from "../utils/math";
import GameTerrain from "../game/GameTerrain.mjs";
import GameData from "../game/GameData";
import Ship from "../unit/Ship.js";
import Vector from "../utils/Vector.js";
import Offset from "../hexagon/Offset.js";
import { THRUSTER_DIRECTION } from "../unit/system/strategy/ThrustChannelSystemStrategy.js";

class MovementService {
  private gamedata: GameData | null;
  private terrain: GameTerrain;

  constructor() {
    this.gamedata = null;
    this.terrain = new GameTerrain();
  }

  update(gamedata: GameData, phaseDirector) {
    this.gamedata = gamedata;
    this.phaseDirector = phaseDirector;

    return this;
  }

  getGameData(): GameData {
    if (!this.gamedata) {
      throw new Error("GameData is not set");
    }

    return this.gamedata;
  }

  /*
  isMoved(ship: Ship, turn: number) {
    
    const end = this.getLastEndMove(ship);

    if (!end) {
      return false;
    }

    return end.turn === turn;
    
  }
    

  getShipsInSameHex(ship: Ship, hex) {
    hex = hex && this.getMostRecentMove(ship).position;
    return this.gamedata.ships.filter(
      (ship2) =>
        ship2.isDestroyed() &&
        ship !== ship2 &&
        this.   (ship2).position.equals(hex)
    );
  }
    */

  getNewEndMove(ship: Ship) {
    const startMove = ship.movement.getLastEndMoveOrSurrogate();
    const lastMove = ship.movement.getLastMove();
    const vector = lastMove.getVelocity();

    const { position, velocity } = this.terrain.getGravityVectorForTurn(
      startMove.position,
      vector
    );

    return new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      position,
      velocity,
      lastMove.facing,
      lastMove.rolled,
      startMove.turn + 1,
      0
    ).setEvasion(ship.movement.getEvasion());
  }

  deploy(ship: Ship, pos: Vector | Offset) {
    let deployMove = ship.movement.getDeployMove();

    if (!deployMove) {
      const lastMove = ship.movement.getLastMove();
      deployMove = new MovementOrder(
        -1,
        MOVEMENT_TYPE.DEPLOY,
        pos,
        lastMove.velocity,
        lastMove.facing,
        lastMove.rolled,
        this.getGameData().turn,
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

  doDeploymentTurn(ship: Ship, step: 1 | -1) {
    const deployMove = ship.movement.getDeployMove();
    const newfacing = addToHexFacing(deployMove.facing, step);
    deployMove.facing = newfacing;
    ship.movement.replaceDeployMove(deployMove);
    this.shipStateChanged(ship);
  }

  getPositionAtStartOfTurn(ship: Ship, currentTurn: number) {
    if (currentTurn === undefined) {
      currentTurn = this.getGameData().turn;
    }

    let move = null;

    for (var i = ship.movement.length - 1; i >= 0; i--) {
      move = ship.movement[i];
      if (move.turn < currentTurn) {
        break;
      }
    }

    return new Offset(move.position);
  }

  shipStateChanged(ship: Ship) {
    this.phaseDirector.relayEvent("shipStateChanged", ship);
  }

  canThrust(ship: Ship, direction: THRUSTER_DIRECTION) {
    return new MovementResolver(ship, this, this.getGameData().turn).canThrust(
      direction
    );
  }

  thrust(ship: Ship, direction: THRUSTER_DIRECTION) {
    new MovementResolver(ship, this, this.getGameData().turn).thrust(direction);
  }

  canCancel(ship: Ship) {
    return new MovementResolver(
      ship,
      this,
      this.getGameData().turn
    ).canCancel();
  }

  canRevert(ship: Ship) {
    return new MovementResolver(
      ship,
      this,
      this.getGameData().turn
    ).canRevert();
  }

  cancel(ship: Ship) {
    new MovementResolver(ship, this, this.getGameData().turn).cancel();
  }

  revert(ship: Ship) {
    new MovementResolver(ship, this, this.getGameData().turn).revert();
  }

  canPivot(ship: Ship, turnDirection: 1 | -1) {
    if (turnDirection !== 1 && turnDirection !== -1) {
      throw new Error("While pivoting direction must be 1 or -1");
    }

    return new MovementResolver(ship, this, this.getGameData().turn).canPivot(
      turnDirection
    );
  }

  pivot(ship: Ship, turnDirection: 1 | -1) {
    if (turnDirection !== 1 && turnDirection !== -1) {
      throw new Error("While pivoting direction must be 1 or -1");
    }

    return new MovementResolver(ship, this, this.getGameData().turn).pivot(
      turnDirection
    );
  }

  canRoll(ship: Ship) {
    return new MovementResolver(ship, this, this.getGameData().turn).canRoll();
  }

  roll(ship: Ship) {
    return new MovementResolver(ship, this, this.getGameData().turn).roll();
  }

  canEvade(ship: Ship, step: 1 | -1) {
    if (step !== 1 && step !== -1) {
      throw new Error("While evading step must be 1 or -1");
    }

    if (ship.movement.getEvasion() + step > ship.movement.getMaxEvasion()) {
      return false;
    }

    return new MovementResolver(ship, this, this.getGameData().turn).canEvade(
      step
    );
  }

  evade(ship: Ship, step: 1 | -1) {
    if (step !== 1 && step !== -1) {
      throw new Error("While evading step must be 1 or -1");
    }

    return new MovementResolver(ship, this, this.getGameData().turn).evade(
      step
    );
  }
}

export default MovementService;
