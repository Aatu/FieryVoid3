import { InvalidGameDataError, UnauthorizedError } from "../errors";
import { UnableToAssignEw } from "../../model/unit/ShipElectronicWarfare";

class WeaponHandler {
  receiveFireOrders(serverGameData, clientGameData, activeShips, user) {
    activeShips.forEach(serverShip => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      const entries = clientShip.electronicWarfare.getAllEntries();
      try {
        serverShip.electronicWarfare.assignEntries(entries);
      } catch (e) {
        if (e instanceof UnableToAssignEw) {
          throw new InvalidGameDataError(e.message);
        }
        throw e;
      }
    });
  }

  advance(gameData) {
    gameData.ships.getShips().forEach(ship => {
      ship.electronicWarfare.activatePlananedElectronicWarfare();
      ship.electronicWarfare.repeatElectonicWarfare();
    });
  }
}

export default WeaponHandler;
