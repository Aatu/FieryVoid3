import GameData from "@fieryvoid3/model/src/game/GameData";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { User } from "@fieryvoid3/model/src/User/User";

class SystemDataHandler {
  receiveSystemData(
    serverGameData: GameData,
    clientGameData: GameData,
    activeShips: Ship[]
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
