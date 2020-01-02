import FireOrder from "./FireOrder.mjs";

class WeaponFireService {
  constructor() {
    this.gamedata = null;
  }

  update(gamedata) {
    this.gamedata = gamedata;

    return this;
  }

  getAllFireOrders() {
    return this.gamedata.ships
      .getShips()
      .reduce(
        (all, ship) => [...all, ...this.getAllFireOrdersForShip(ship)],
        []
      );
  }

  getFireOrderById(id) {
    return this.getAllFireOrders().find(order => order.id === id);
  }

  getAllFireOrdersForShip(shooter) {
    return shooter.systems
      .getSystems()
      .reduce(
        (all, system) => [
          ...all,
          ...system.callHandler("getFireOrders", {}, [])
        ],
        []
      );
  }

  systemHasFireOrder(system) {
    const fireOrders = system.callHandler("getFireOrders");
    return fireOrders && fireOrders.length > 0;
  }

  systemHasFireOrderAgainstShip(system, target) {
    const fireOrders = system.callHandler("getFireOrders", null, []);

    return fireOrders.some(order => order.targetId === target.id);
  }

  addFireOrder(shooter, target, weapon) {
    if (!this.canFire(shooter, target, weapon)) {
      throw new Error("Check validity first");
    }

    return weapon.callHandler("addFireOrder", {
      shooter,
      target
    });
  }

  removeFireOrders(shooter, weapon) {
    weapon.callHandler("removeFireOrders");
  }

  canFire(shooter, target, weapon) {
    if (
      shooter.isDestroyed() ||
      target.isDestroyed() ||
      weapon.isDisabled() ||
      !weapon.callHandler("usesFireOrders", null, false)
    ) {
      return false;
    }

    if (!weapon.callHandler("canFire", null, true)) {
      console.log("weapon can not fire");
      return false;
    }

    return true;
  }
}

export default WeaponFireService;
