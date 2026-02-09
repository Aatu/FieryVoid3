import GameData from "../../model/src/game/GameData";
import MovementService from "../../model/src/movement/MovementService";
import Ship from "../../model/src/unit/Ship";
import { User } from "../../model/src/User/User";
import { InvalidGameDataError, UnauthorizedError } from "../errors/index";

import { v4 as uuidv4 } from "uuid";
import MovementValidator from "../services/validation/MovementValidator";
import CombatLogShipMovement from "../../model/src/combatLog/CombatLogShipMovement";
class MovementHandler {
  private movementService: MovementService;

  constructor() {
    this.movementService = new MovementService();
    //this.collisionAvoider = new CollisionAvoider();
  }

  receiveMoves(
    serverGameData: GameData,
    clientGameData: GameData,
    activeShips: Ship[],
    user: User
  ) {
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

  advance(gameData: GameData) {
    gameData.ships.getShips().forEach((ship) => {
      ship.movement.addMovement(
        this.movementService.getNewEndMove(ship).setId(uuidv4())
      );
      gameData.combatLog.addEntry(new CombatLogShipMovement(ship.id));
    });

    //TODO: collision damage from friendly ships
    this.avoidCollisions(gameData);
  }

  avoidCollisions(gameData: GameData) {
    //this.collisionAvoider.avoidCollisions(gameData);
  }

  applyRolls(gameData: GameData) {
    gameData.ships.getShips().forEach((ship) => {
      ship.movement.applyRoll();
    });
  }
}

export default MovementHandler;
