import { MovementOrder, MovementResolver } from "./index";
import { addToHexFacing } from "../utils/math";
import GameTerrain from "../game/GameTerrain";
class MovementService {
    gamedata = null;
    terrain = null;
    phaseDirector = null;
    constructor() {
        this.gamedata = null;
        this.terrain = null;
    }
    update(gamedata, phaseDirector) {
        this.gamedata = gamedata;
        this.phaseDirector = phaseDirector;
        this.terrain = new GameTerrain(gamedata);
        return this;
    }
    getGameData() {
        if (!this.gamedata) {
            throw new Error("GameData is not set");
        }
        return this.gamedata;
    }
    getTerrain() {
        if (!this.terrain) {
            throw new Error("Terrain is not set");
        }
        return this.terrain;
    }
    getPhaseDirector() {
        if (!this.phaseDirector) {
            throw new Error("PhaseDirector is not set");
        }
        return this.phaseDirector;
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
    getNewEndMove(ship) {
        const startMove = ship.movement.getLastEndMoveOrSurrogate();
        const lastMove = ship.movement.getLastMove();
        const velocity = lastMove.getVelocity();
        return new MovementOrder(null, "end" /* MOVEMENT_TYPE.END */, startMove.position.add(velocity), velocity, lastMove.facing, lastMove.rolled, startMove.turn + 1, 0).setEvasion(ship.movement.getEvasion());
    }
    deploy(ship, pos) {
        let deployMove = ship.movement.getDeployMove();
        if (!deployMove) {
            const lastMove = ship.movement.getLastMove();
            deployMove = new MovementOrder(null, "deploy" /* MOVEMENT_TYPE.DEPLOY */, pos, lastMove.velocity, lastMove.facing, lastMove.rolled, this.getGameData().turn, 0, null, 1);
            ship.movement.addMovement(deployMove);
        }
        else {
            deployMove.setPosition(pos);
            ship.movement.replaceDeployMove(deployMove);
        }
    }
    doDeploymentTurn(ship, step) {
        const deployMove = ship.movement.getDeployMove();
        if (!deployMove) {
            throw new Error("Deployment move not found");
        }
        const newfacing = addToHexFacing(deployMove.facing, step);
        deployMove.facing = newfacing;
        ship.movement.replaceDeployMove(deployMove);
        this.shipStateChanged({ ship });
    }
    /*
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
      */
    shipStateChanged({ ship }) {
        this.getPhaseDirector().relayEvent("shipStateChanged", { ship });
    }
    canThrust(ship, direction) {
        return new MovementResolver(ship, this, this.getGameData().turn).canThrust(direction);
    }
    thrust(ship, direction) {
        new MovementResolver(ship, this, this.getGameData().turn).thrust(direction);
    }
    canCancel(ship) {
        return new MovementResolver(ship, this, this.getGameData().turn).canCancel();
    }
    canRevert(ship) {
        return new MovementResolver(ship, this, this.getGameData().turn).canRevert();
    }
    cancel(ship) {
        new MovementResolver(ship, this, this.getGameData().turn).cancel();
    }
    revert(ship) {
        new MovementResolver(ship, this, this.getGameData().turn).revert();
    }
    canPivot(ship, turnDirection) {
        if (turnDirection !== 1 && turnDirection !== -1) {
            throw new Error("While pivoting direction must be 1 or -1");
        }
        return new MovementResolver(ship, this, this.getGameData().turn).canPivot(turnDirection);
    }
    pivot(ship, turnDirection) {
        if (turnDirection !== 1 && turnDirection !== -1) {
            throw new Error("While pivoting direction must be 1 or -1");
        }
        return new MovementResolver(ship, this, this.getGameData().turn).pivot(turnDirection);
    }
    canRoll(ship) {
        return new MovementResolver(ship, this, this.getGameData().turn).canRoll();
    }
    roll(ship) {
        return new MovementResolver(ship, this, this.getGameData().turn).roll();
    }
    canEvade(ship, step) {
        if (step !== 1 && step !== -1) {
            throw new Error("While evading step must be 1 or -1");
        }
        if (ship.movement.getEvasion() + step > ship.movement.getMaxEvasion()) {
            return false;
        }
        return new MovementResolver(ship, this, this.getGameData().turn).canEvade(step);
    }
    evade(ship, step) {
        if (step !== 1 && step !== -1) {
            throw new Error("While evading step must be 1 or -1");
        }
        return new MovementResolver(ship, this, this.getGameData().turn).evade(step);
    }
}
export default MovementService;
