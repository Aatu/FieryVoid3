import ShipSystemStrategy from "../ShipSystemStrategy.mjs";

class StandardHitStrategy extends ShipSystemStrategy {
  constructor(fireControl = 0, numberOfShots = 1) {
    super();
    this.fireControl = fireControl;
    this.numberOfShots = numberOfShots;
  }

  getBaseHitChange({ shooter, target, weaponSettings }) {
    return target.getHitProfile(shooter.getPosition());
  }

  checkFireOrderHits({ shooter, target, weaponSettings }) {
    const toHit = this.getHitChange({ shooter, target, weaponSettings });
    const roll = Math.ceil(Math.random() * 100);

    const hit = roll <= toHit.result;

    return hit;
  }

  getHitChange({ shooter, target, weaponSettings = {} }) {
    const baseToHit = this.system.callHandler("getBaseHitChange", {
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

    const rangeModifier = this.system.callHandler("getRangeModifier", {
      distance,
      weaponSettings
    });

    let result =
      baseToHit + this.fireControl + oew * 5 - dew * 5 + rangeModifier;

    if (rangeModifier === false) {
      result = 0;
    }

    return {
      baseToHit,
      fireControl: this.fireControl,
      dew: dew,
      oew: oew,
      distance,
      rangeModifier,
      result: result
    };
  }
}

export default StandardHitStrategy;
