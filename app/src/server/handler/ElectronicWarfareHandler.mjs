import { InvalidGameDataError, UnauthorizedError } from "../errors/index.mjs";
import { UnableToAssignEw } from "../../model/unit/ShipElectronicWarfare.mjs";

class ElectronicWarfareHandler {
  receiveElectronicWarfare(serverGameData, clientGameData, activeShips, user) {
    activeShips.forEach(serverShip => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      const entries = clientShip.electronicWarfare.getAllEntries();
      try {
        console.log("receive EW", entries);
        serverShip.electronicWarfare.assignEntries(entries);
      } catch (e) {
        if (e instanceof UnableToAssignEw) {
          throw new InvalidGameDataError(e.message);
        }
        throw e;
      }
    });
  }

  advance(gameData) {}
}

export default ElectronicWarfareHandler;
