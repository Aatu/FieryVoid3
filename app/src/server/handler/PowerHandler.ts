import GameData from "../../model/src/game/GameData";
import Ship from "../../model/src/unit/Ship";
import { SYSTEM_HANDLERS } from "../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import { User } from "../../model/src/User/User";

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
