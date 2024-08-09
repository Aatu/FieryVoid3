import { v4 as uuidv4 } from "uuid";
import { InvalidGameDataError } from "../errors/index";
import GameData from "../../model/src/game/GameData";
import { User } from "../../model/src/User/User";
import { GAME_PHASE } from "../../model/src/game/gamePhase";
import { MOVEMENT_TYPE, MovementOrder } from "../../model/src/movement";
import Ship from "../../model/src/unit/Ship";

class DeploymentHandler {
  deploy(serverGameData: GameData, clientGameData: GameData, user: User) {
    if (serverGameData.phase !== GAME_PHASE.DEPLOYMENT) {
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

    serverShips.forEach((serverShip) => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      if (!clientShip) {
        throw new InvalidGameDataError(
          `Client did not have ship for id: "${serverShip.id}"`
        );
      }
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
          `Invalid deployment for ship ${serverShip.name}: not a valid deployment facing`
        );
      }

      const serverFirstMove = serverShip.movement.getStartMove();

      const oldServerDeployMove = serverShip.movement.getDeployMove();

      const serverDeployMove = new MovementOrder(
        oldServerDeployMove ? oldServerDeployMove.id : uuidv4(),
        MOVEMENT_TYPE.DEPLOY,
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
          `Invalid deployment for ship ${serverShip.name}: deployment move malformed`
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

  checkShipsOnSamePosition(serverShips: Ship[]) {
    serverShips.forEach((ship) => {
      const other = serverShips.find(
        (otherShip) =>
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

  advance(gameData: GameData) {
    gameData.players.forEach((player) => gameData.setPlayerActive(player));
    gameData.ships.getShips().forEach((ship) => gameData.setActiveShip(ship));
    gameData.setPhase(GAME_PHASE.GAME);
  }
}

export default DeploymentHandler;
