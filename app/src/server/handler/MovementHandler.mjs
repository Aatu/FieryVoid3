import { InvalidGameDataError } from "../errors";
import MovementValidator from "../services/validation/MovementValidator";
import MovementService from "../../model/movement/MovementService";
import coordinateConverter from "../../model/utils/CoordinateConverter";

class MovementHandler {
  constructor(gameDataService) {
    this.gameDataService = gameDataService;

    this.movementService = new MovementService();
    this.coordinateConverter = coordinateConverter;
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
        serverShip.movement.getLastEndMoveOrSurrogate()
      );

      validator.validate();

      serverShip.movement.replaceMovement(clientShip.movement.getMovement());
      serverShip.movement.addMovement(
        this.movementService.getNewEndMove(
          serverShip,
          serverGameData.terrain,
          this.coordinateConverter
        )
      );
    });
  }
}

export default MovementHandler;
