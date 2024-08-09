import GameData from "../../model/src/game/GameData";
import Ship from "../../model/src/unit/Ship";
import { User } from "../../model/src/User/User";

class SystemDataHandler {
  receiveSystemData(
    serverGameData: GameData,
    clientGameData: GameData,
    activeShips: Ship[],
    user: User
  ) {
    activeShips.forEach((serverShip) => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      let count = serverShip.getRequiredPhasesForReceivingPlayerData();

      for (let phase = count; phase > 0; phase--) {
        serverShip.receivePlayerData(clientShip, serverGameData, phase);
      }
    });
  }

  advance(gameData: GameData) {}
}

export default SystemDataHandler;
