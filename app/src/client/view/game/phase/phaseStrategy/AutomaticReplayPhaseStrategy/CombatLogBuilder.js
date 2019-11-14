import CombatLogEntry from "./CombatLogEntry";
import WeaponFireService from "../../../../../../model/weapon/WeaponFireService.mjs";

class CombatLogBuilder {
  createLog(replayContext, gameData) {
    console.log("gamedata", gameData);

    const weaponFireService = new WeaponFireService().update(gameData);
    console.log("builder");

    const entries = [];

    gameData.ships.getShips().forEach(ship => {
      const fireOrders = weaponFireService.getAllFireOrdersForShip(ship);

      fireOrders.forEach(fireOrder => {
        const target = gameData.ships.getShipById(fireOrder.targetId);
        const weapon = ship.systems.getSystemById(fireOrder.weaponId);

        const entry = new CombatLogEntry(
          fireOrder,
          ship,
          target,
          weapon,
          gameData
        );
        entries.push(entry);
      });
    });

    return entries;
  }
}

export default CombatLogBuilder;
