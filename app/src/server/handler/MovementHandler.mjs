import { InvalidGameDataError, UnauthorizedError } from "../errors";
import MovementValidator from "../services/validation/MovementValidator";
import MovementService from "../../model/movement/MovementService";
import uuidv4 from "uuid/v4";

class MovementHandler {
  constructor() {
    this.movementService = new MovementService();
  }

  receiveMoves(serverGameData, clientGameData, user) {
    if (!user) {
      throw new UnauthorizedError("Not logged in");
    }

    const activeShips = serverGameData.getActiveShipsForUser(user);

    if (activeShips.length === 0) {
      throw new InvalidGameDataError("Current user has no active ships");
    }

    activeShips.forEach(serverShip => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      const startMove = serverShip.movement.getLastEndMoveOrSurrogate();
      const validator = new MovementValidator(
        clientShip,
        serverGameData.turn,
        startMove
      );

      validator.validate();

      serverShip.movement.replaceMovement(
        clientShip.movement.getMovement().map(move => move.setId(uuidv4()))
      );

      serverShip.movement.addMovement(
        this.movementService
          .getNewEndMove(serverShip, serverGameData.terrain)
          .setId(uuidv4())
      );
    });
  }
}

export default MovementHandler;
