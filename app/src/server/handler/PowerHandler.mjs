import { InvalidGameDataError, UnauthorizedError } from "../errors/index.mjs";
import { UnableToAssignEw } from "../../model/unit/ShipElectronicWarfare.mjs";

class PowerHandler {
  receivePower(serverGameData, clientGameData, activeShips, user) {
    activeShips.forEach(serverShip => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      serverShip.systems.power.copyPower(clientShip);
    });
  }

  advance(gameData) {}
}

export default PowerHandler;
