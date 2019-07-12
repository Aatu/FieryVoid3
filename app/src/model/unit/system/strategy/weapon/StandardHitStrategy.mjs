import ShipSystemStrategy from "../ShipSystemStrategy.mjs";

class StandardHitStrategy extends ShipSystemStrategy {
  getBaseHitChange({ shooter, target, weaponSettings }) {
    return target.getHitProfile(shooter.getPosition());
  }

  checkFireOrderHits({ fireOrder, gameData }) {
    const toHit = this.getHitChange({ fireOrder, gameData });
    const roll = Math.ceil(Math.random() * 100);

    const hit = roll <= toHit;

    return hit;
  }

  getHitChange({ fireOrder, gameData }) {
    const shooter = gameData.ships.getShipById(fireOrder.shooterId);
    const target = gameData.ships.getShipById(fireOrder.shooterId);
    const weapon = shooter.systems.getSystemById(fireOrder.weaponId);
    const weaponSettings = fireOrder.weaponSettings;

    if (weapon !== this.system) {
      throw new Error("Wrong system");
    }

    const baseToHit = weapon.callHandler("getBaseHitChange", {
      shooter,
      target,
      weaponSettings
    });

    const dew = target.electronicWarfare.inEffect.getDefensiveEw();
    const oew = shooter.electronicWarfare.inEffect.getOffensiveEw(target);

    let distance = shooter.getHexPosition().distanceTo(target.getHexPosition());
    if (oew === 0) {
      distance *= 2;
    }

    const rangeModifier = weapon.callHandler("getRangeModifier", {
      distance,
      weaponSettings
    });

    if (rangeModifier === false) {
      return 0;
    }

    return baseToHit + oew - dew + rangeModifier;
  }
}

export default StandardHitStrategy;
