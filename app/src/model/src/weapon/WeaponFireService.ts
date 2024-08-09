import GameData from "../game/GameData";
import Ship from "../unit/Ship";
import ShipSystem from "../unit/system/ShipSystem";
import { SYSTEM_HANDLERS } from "../unit/system/strategy/types/SystemHandlersTypes";
import Weapon from "../unit/system/weapon/Weapon";
import FireOrder from "./FireOrder";

class WeaponFireService {
  private gamedata: GameData | null = null;

  getGameData(): GameData {
    if (!this.gamedata) {
      throw new Error("No game data set");
    }

    return this.gamedata;
  }

  update(gamedata: GameData) {
    this.gamedata = gamedata;

    return this;
  }

  getAllFireOrders() {
    return this.getGameData()
      .ships.getShips()
      .reduce(
        (all, ship) => [...all, ...this.getAllFireOrdersForShip(ship)],
        [] as FireOrder[]
      );
  }

  getFireOrderById(id: string) {
    return this.getAllFireOrders().find((order) => order.id === id);
  }

  getAllFireOrdersForShip(shooter: Ship) {
    return shooter.systems
      .getSystems()
      .reduce(
        (all, system) => [
          ...all,
          ...system.callHandler(
            SYSTEM_HANDLERS.getFireOrders,
            {},
            [] as FireOrder[]
          ),
        ],
        [] as FireOrder[]
      );
  }

  systemHasFireOrder(system: ShipSystem) {
    const fireOrders = system.callHandler(
      SYSTEM_HANDLERS.getFireOrders,
      undefined,
      [] as FireOrder[]
    );
    return fireOrders && fireOrders.length > 0;
  }

  getSystemFireOrderTargetId(system: ShipSystem) {
    const fireOrders = system.callHandler(
      SYSTEM_HANDLERS.getFireOrders,
      undefined,
      [] as FireOrder[]
    );
    return fireOrders && fireOrders.length > 0 ? fireOrders[0].targetId : null;
  }

  systemHasFireOrderAgainstShip(system: ShipSystem, target: Ship) {
    const fireOrders = system.callHandler(
      SYSTEM_HANDLERS.getFireOrders,
      null,
      [] as FireOrder[]
    );

    return fireOrders.some((order) => order.targetId === target.id);
  }

  addFireOrder(shooter: Ship, target: Ship, weapon: ShipSystem): FireOrder[] {
    if (!this.canFire(shooter, target, weapon)) {
      throw new Error("Check validity first");
    }

    return weapon.callHandler(
      SYSTEM_HANDLERS.addFireOrder,
      {
        shooter,
        target,
      },
      [] as FireOrder[]
    );
  }

  removeFireOrders(shooter: Ship, weapon: Weapon) {
    weapon.callHandler(SYSTEM_HANDLERS.removeFireOrders, undefined, undefined);
  }

  canFire(shooter: Ship, target: Ship, weapon: Weapon) {
    if (
      shooter.isDestroyed() ||
      target.isDestroyed() ||
      weapon.isDisabled() ||
      !weapon.callHandler(
        SYSTEM_HANDLERS.usesFireOrders,
        null,
        false as boolean
      )
    ) {
      return false;
    }

    if (
      !weapon.callHandler(SYSTEM_HANDLERS.isOnArc, { target }, true as boolean)
    ) {
      return false;
    }

    if (!weapon.callHandler(SYSTEM_HANDLERS.canFire, null, true as boolean)) {
      return false;
    }

    return true;
  }
}

export default WeaponFireService;
