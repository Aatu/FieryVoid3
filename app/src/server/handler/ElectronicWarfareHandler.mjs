import { InvalidGameDataError, UnauthorizedError } from "../errors";
import { UnableToAssignEw } from "../../model/unit/ShipElectronicWarfare";

class ElectronicWarfareHandler {
  receiveElectronicWarfare(serverGameData, clientGameData, activeShips, user) {
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

  advance() {
    //TODO: repeat EW for next turn, if possible
  }
}

export default ElectronicWarfareHandler;
