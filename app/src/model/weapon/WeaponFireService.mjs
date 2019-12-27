import FireOrder from "./FireOrder.mjs";

class WeaponFireService {
  /*
    TODO:

    Weapon firing sequence
        - weapon fires as many times as it has shots assigned
        - compare DEW and OEW
        - calculate the hit change using targets to hit profile, weapons range strategy (affected by evasion), and weapon hit strategy
        - RNG if hit actually lands
        - Apply damage, criticals and heat according to weapon damage strategy
    */

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
    const fireOrders = system.callHandler("getFireOrders");

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
      !weapon.canTarget()
    ) {
      return false;
    }

    if (!weapon.callHandler("isLoaded")) {
      return false;
    }

    return true;
  }
}

export default WeaponFireService;
