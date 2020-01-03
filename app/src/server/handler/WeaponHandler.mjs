import { InvalidGameDataError, UnauthorizedError } from "../errors/index.mjs";
import WeaponFireService from "../../model/weapon/WeaponFireService.mjs";
import uuidv4 from "uuid/v4.js";
import { shuffleArray } from "../../model/utils/math.mjs";

class WeaponHandler {
  receiveFireOrders(serverGameData, clientGameData, activeShips, user) {
    const clientFireService = new WeaponFireService().update(clientGameData);
    const serverFireService = new WeaponFireService().update(serverGameData);

    activeShips.forEach(serverShip => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);

      clientFireService
        .getAllFireOrdersForShip(clientShip)
        .forEach(fireOrder => {
          const shooter = serverGameData.ships.getShipById(fireOrder.shooterId);
          const target = serverGameData.ships.getShipById(fireOrder.targetId);
          const weapon = shooter.systems.getSystemById(fireOrder.weaponId);

          if (!serverFireService.canFire(shooter, target, weapon)) {
            throw new InvalidGameDataError("Invalid fire order");
          }

          serverFireService
            .addFireOrder(shooter, target, weapon)
            .forEach(order => order.setId(uuidv4()));
        });
    });
  }

  advance(gameData) {
    shuffleArray(this.getAllSystemsWithFireOrders(gameData))
      .sort((a, b) => {
        const aPriority = a.callHandler(
          "getFireOrderResolutionPriority",
          null,
          10
        );

        const bPriority = b.callHandler(
          "getFireOrderResolutionPriority",
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
      .forEach(system => {
        system.callHandler("executeFireOrders", { gameData });
      });
  }

  getAllSystemsWithFireOrders(gameData) {
    return gameData.ships.getShips().reduce((total, ship) => {
      return [
        ...total,
        ...ship.systems
          .getSystems()
          .filter(system => system.callHandler("hasFireOrder", null, false))
      ];
    }, []);
  }
}

export default WeaponHandler;
