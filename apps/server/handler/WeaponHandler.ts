import GameData from "../../model/src/game/GameData";
import Ship from "../../model/src/unit/Ship";
import { User } from "../../model/src/User/User";
import { InvalidGameDataError } from "../errors/index";
import WeaponFireService from "../../model/src/weapon/WeaponFireService";

import { v4 as uuidv4 } from "uuid";
import { shuffleArray } from "../../model/src/utils/math";
import ShipSystem from "../../model/src/unit/system/ShipSystem";
import { SYSTEM_HANDLERS } from "../../model/src/unit/system/strategy/types/SystemHandlersTypes";

class WeaponHandler {
  receiveFireOrders(
    serverGameData: GameData,
    clientGameData: GameData,
    activeShips: Ship[],
    user: User
  ) {
    const clientFireService = new WeaponFireService().update(clientGameData);
    const serverFireService = new WeaponFireService().update(serverGameData);

    activeShips.forEach((serverShip) => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);

      clientFireService
        .getAllFireOrdersForShip(clientShip)
        .forEach((fireOrder) => {
          const shooter = serverGameData.ships.getShipById(fireOrder.shooterId);
          const target = serverGameData.ships.getShipById(fireOrder.targetId);
          const weapon = shooter.systems.getSystemById(fireOrder.weaponId);

          if (!serverFireService.canFire(shooter, target, weapon)) {
            throw new InvalidGameDataError("Invalid fire order");
          }

          serverFireService
            .addFireOrder(shooter, target, weapon)
            .forEach((order) => order.setId(uuidv4()));
        });
    });
  }

  advance(gameData: GameData) {
    shuffleArray(this.getAllSystemsWithFireOrders(gameData))
      .sort((a, b) => {
        const aPriority = a.callHandler(
          SYSTEM_HANDLERS.getFireOrderResolutionPriority,
          null,
          10
        );

        const bPriority = b.callHandler(
          SYSTEM_HANDLERS.getFireOrderResolutionPriority,
          null,
          10
        );

        if (aPriority > bPriority) {
          return 1;
        }

        if (aPriority < bPriority) {
          return -1;
        }

        return 0;
      })
      .forEach((system) => {
        system.callHandler(
          SYSTEM_HANDLERS.executeFireOrders,
          { gameData },
          undefined
        );
      });
  }

  getAllSystemsWithFireOrders(gameData: GameData) {
    return gameData.ships.getShips().reduce((total, ship) => {
      return [
        ...total,
        ...ship.systems
          .getSystems()
          .filter((system) =>
            system.callHandler(
              SYSTEM_HANDLERS.hasFireOrder,
              null,
              false as boolean
            )
          ),
      ];
    }, [] as ShipSystem[]);
  }
}

export default WeaponHandler;
