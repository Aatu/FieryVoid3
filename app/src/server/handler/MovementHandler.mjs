import { InvalidGameDataError, UnauthorizedError } from "../errors/index.mjs";
import MovementValidator from "../services/validation/MovementValidator.mjs";
import MovementService from "../../model/movement/MovementService.mjs";
import { v4 as uuidv4 } from "uuid";
import CollisionAvoider from "../services/movement/CollisionAvoider.mjs";
import CombatLogShipMovement from "../../model/combatLog/CombatLogShipMovement.mjs";

class MovementHandler {
  constructor() {
    this.movementService = new MovementService();
    this.collisionAvoider = new CollisionAvoider();
  }

  receiveMoves(serverGameData, clientGameData, activeShips, user) {
    activeShips.forEach((serverShip) => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      const startMove = serverShip.movement.getLastEndMoveOrSurrogate();
      const validator = new MovementValidator(
        clientShip,
        serverGameData.turn,
        startMove
      );

      validator.validate();

      serverShip.movement.replaceMovement(
        clientShip.movement.getMovement().map((move) => move.setId(uuidv4()))
      );

      serverShip.movement.payFuelCost();
    });
  }

  advance(gameData) {
    gameData.ships.getShips().forEach((ship) => {
      ship.movement.addMovement(
        this.movementService.getNewEndMove(ship).setId(uuidv4())
      );
      gameData.combatLog.addEntry(new CombatLogShipMovement(ship.id));
    });

    //TODO: collision damage from friendly ships
    this.avoidCollisions(gameData);
  }

  avoidCollisions(gameData) {
    //this.collisionAvoider.avoidCollisions(gameData);
  }

  applyRolls(gameData) {
    gameData.ships.getShips().forEach((ship) => {
      ship.movement.applyRoll();
    });
  }
}

export default MovementHandler;
