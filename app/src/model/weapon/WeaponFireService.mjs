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

  getAllFireOrders(shooter) {
    return shooter.systems.getSystems((all, system) => [
      ...all,
      ...system.callHandler("getFireOrders")
    ]);
  }

  addFireOrder(shooter, target, weapon) {
    if (!this.canFire(shooter, target, weapon)) {
      throw new Error("Check validity first");
    }

    weapon.callHandler("addFireOrder", { shooter, target });
  }

  canFire(shooter, target, weapon) {
    if (shooter.isDestroyed() || target.isDestroyed() || weapon.isDisabled()) {
      return false;
    }

    if (!weapon.callHandler("isOnArc", { shooter, target })) {
      return false;
    }

    if (!weapon.callHandler("isLoaded")) {
      return false;
    }

    return true;
  }

  getHitChange(fireOrder) {
    const shooter = this.gamedata.ships.getShipById(fireOrder.shooterId);
    const target = this.gamedata.ships.getShipById(fireOrder.shooterId);
    const weapon = shooter.systems.getSystemById(FireOrder.weaponId);
    const weaponSettings = fireOrder.weaponSettings;

    const baseToHit = weapon.callHandler("getBaseHitChange", {
      shooter,
      target,
      weaponSettings
    });

    const dew = target.electronicWarfre.inEffect.getDefensiveEw();
    const oew = shooter.electronicWarfre.inEffect.getOffensiveEw(target);

    let distance = shooter.getHexPosition().distance(target.getHexPosition());
    if (oew === 0) {
      distance *= 2;
    }

    const rangeModifier = weapon.callHandler("getRangeModifier", {
      distance,
      weaponSettings
    });

    return baseToHit + oew - dew + rangeModifier;
  }
}

export default WeaponFireService;
