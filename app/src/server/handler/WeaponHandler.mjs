import { InvalidGameDataError, UnauthorizedError } from "../errors/index.mjs";
import WeaponFireService from "../../model/weapon/WeaponFireService.mjs";
import uuidv4 from "uuid/v4.js";

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

          const order = serverFireService.addFireOrder(shooter, target, weapon);
          order.setId(uuidv4());
        });
    });
  }

  advance(gameData) {
    gameData.ships.getShips().forEach(ship => {
      ship.systems
        .getSystems()
        .forEach(system =>
          system.callHandler("executeFireOrders", { gameData })
        );
    });
  }
}

export default WeaponHandler;
