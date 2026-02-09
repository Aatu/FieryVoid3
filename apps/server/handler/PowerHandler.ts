import GameData from "@fieryvoid3/model/src/game/GameData";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { SYSTEM_HANDLERS } from "@fieryvoid3/model/src/unit/system/strategy/types/SystemHandlersTypes";
import { User } from "@fieryvoid3/model/src/User/User";

class PowerHandler {
  receivePower(
    serverGameData: GameData,
    clientGameData: GameData,
    activeShips: Ship[],
    user: User
  ) {
    activeShips.forEach((serverShip) => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      serverShip.systems.power.copyPower(clientShip);
    });
  }

  forceValidPower(activeShips: Ship[]) {
    activeShips.forEach((serverShip) => {
      if (!serverShip.systems.power.isValidPower()) {
        console.log("forcing valid power for " + serverShip.id);
        serverShip.systems.power.forceValidPower();
      }
    });
  }

  advance(gameData: GameData) {
    gameData.ships.getShips().forEach((ship) => {
      ship.systems
        .getSystems()
        .filter((system) =>
          system.callHandler(
            SYSTEM_HANDLERS.shouldBeOffline,
            null,
            false as boolean
          )
        )
        .forEach((system) => system.power.forceOffline());
    });
  }
}

export default PowerHandler;
