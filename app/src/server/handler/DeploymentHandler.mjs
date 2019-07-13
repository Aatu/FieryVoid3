import uuidv4 from "uuid/v4.js";
import movementTypes from "../../model/movement/movementTypes.mjs";
import MovementOrder from "../../model/movement/MovementOrder.mjs";
import { InvalidGameDataError } from "../errors/index.mjs";
import * as gamePhases from "../../model/game/gamePhases.mjs";

class DeploymentHandler {
  deploy(serverGameData, clientGameData, user) {
    if (serverGameData.phase !== gamePhases.DEPLOYMENT) {
      throw new InvalidGameDataError(
        `Invalid deployment: game phase is not deployment`
      );
    }

    if (!serverGameData.isPlayerActive(user)) {
      throw new InvalidGameDataError(`Invalid deployment: player not active`);
    }

    const serverShips = serverGameData.getActiveShipsForUser(user);

    if (serverShips.length === 0) {
      throw new InvalidGameDataError(`Invalid deployment: no active ships`);
    }

    serverShips.forEach(serverShip => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      const deployMove = clientShip.movement.getDeployMove();

      if (!deployMove) {
        throw new InvalidGameDataError(
          `Invalid deployment for ship ${serverShip.name}: deployment missing`
        );
      }

      const slot = serverGameData.slots.getSlotByShip(serverShip);

      if (
        !slot.isValidShipDeployment(serverShip, deployMove.getHexPosition())
      ) {
        throw new InvalidGameDataError(
          `Invalid deployment for ship ${
            serverShip.name
          }: not a valid deployment location ${deployMove
            .getHexPosition()
            .toString()}`
        );
      }

      if (deployMove.facing < 0 || deployMove.facing > 5) {
        throw new InvalidGameDataError(
          `Invalid deployment for ship ${
            serverShip.name
          }: not a valid deployment facing`
        );
      }

      const serverFirstMove = serverShip.movement.getStartMove();

      const serverDeployMove = new MovementOrder(
        serverShip.movement.getDeployMove()
          ? serverShip.movement.getDeployMove().id
          : uuidv4(),
        movementTypes.DEPLOY,
        deployMove.position,
        serverFirstMove.velocity,
        deployMove.facing,
        serverFirstMove.rolled,
        serverGameData.turn,
        0,
        null,
        1
      );

      if (!serverDeployMove.equals(deployMove)) {
        throw new InvalidGameDataError(
          `Invalid deployment for ship ${
            serverShip.name
          }: deployment move malformed`
        );
      }

      serverShip.movement.replaceDeployMove(serverDeployMove);
      serverGameData.setInactiveShip(serverShip);
      serverGameData.setPlayerInactive(user);
    });

    this.checkShipsOnSamePosition(serverShips);

    if (serverGameData.getActiveShips().length === 0) {
      this.advance(serverGameData);
    }
  }

  checkShipsOnSamePosition(serverShips) {
    serverShips.forEach(ship => {
      const other = serverShips.find(
        otherShip =>
          otherShip.id !== ship.id &&
          otherShip.getHexPosition().equals(ship.getHexPosition())
      );

      if (other) {
        throw new InvalidGameDataError(
          `Invalid deployment: multiple ships on same hex ${other
            .getHexPosition()
            .toString()}`
        );
      }
    });
  }

  advance(gameData) {
    gameData.players.forEach(player => gameData.setPlayerActive(player));
    gameData.ships.getShips().forEach(ship => gameData.setActiveShip(ship));
    gameData.setPhase(gamePhases.GAME);
  }
}

export default DeploymentHandler;
