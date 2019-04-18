import { InvalidGameDataError } from "../errors";
import MovementValidator from "../services/validation/MovementValidator";

class MovementHandler {
  constructor(gameDataService) {
    this.gameDataService = gameDataService;
  }

  receiveMoves(serverGameData, clientGameData, user) {
    const activeShips = serverGameData.getActiveShipsForUser(user);

    if (activeShips.length === 0) {
      throw new InvalidGameDataError("Current user has no active ships");
    }

    activeShips.forEach(serverShip => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      const validator = new MovementValidator(
        clientShip,
        serverGameData.turn,
        serverShip.movement.getFirstMove()
      );

      validator.validate();

      serverShip.movement.replaceMovement(clientShip.movement.getMovement());
      serverShip.movement.addMovement(validator.getNewEndMove());
    });
  }
}

export default MovementHandler;
