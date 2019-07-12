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

  update(gamedata, phaseDirector) {
    this.gamedata = gamedata;
    this.phaseDirector = phaseDirector;

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
      .filter(system => system.isWeapon && system.isWeapon())
      .reduce(
        (all, system) => [...all, ...system.callHandler("getFireOrders")],
        []
      );
  }

  addFireOrder(shooter, target, weapon) {
    if (!this.canFire(shooter, target, weapon)) {
      throw new Error("Check validity first");
    }

    return weapon.callHandler("addFireOrder", { shooter, target });
  }

  canFire(shooter, target, weapon) {
    if (
      shooter.isDestroyed() ||
      target.isDestroyed() ||
      weapon.isDisabled() ||
      !weapon.isWeapon()
    ) {
      console.log("something disabled or not weapon");
      return false;
    }

    if (!weapon.callHandler("isOnArc", { shooter, target })) {
      console.log("not on arc");
      return false;
    }

    if (!weapon.callHandler("isLoaded")) {
      console.log("not loaded");
      return false;
    }

    if (
      weapon.callHandler("getFireOrders").length >=
      weapon.callHandler("getNumberOfShots")
    ) {
      console.log("fire orders already set");
      return false;
    }

    return true;
  }
}

export default WeaponFireService;
