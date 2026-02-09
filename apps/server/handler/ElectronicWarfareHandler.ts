import GameData from "@fieryvoid3/model/src/game/GameData";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { UnableToAssignEw } from "@fieryvoid3/model/src/unit/ShipElectronicWarfare";
import { User } from "@fieryvoid3/model/src/User/User";
import { InvalidGameDataError, UnauthorizedError } from "../errors/index";

class ElectronicWarfareHandler {
  receiveElectronicWarfare(
    serverGameData: GameData,
    clientGameData: GameData,
    activeShips: Ship[],
    user: User
  ) {
    activeShips.forEach((serverShip) => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);

      if (!clientShip) {
        throw new InvalidGameDataError(
          `Clientship id "${serverShip.id}" not found`
        );
      }

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

  advance(gameData: GameData) {}
}

export default ElectronicWarfareHandler;
