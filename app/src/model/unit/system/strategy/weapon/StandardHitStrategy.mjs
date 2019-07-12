import ShipSystemStrategy from "../ShipSystemStrategy.mjs";

class StandardHitStrategy extends ShipSystemStrategy {
  getBaseHitChange({ shooter, target, weaponSettings }) {
    return target.getHitProfile(shooter.getPosition());
  }
}

export default StandardHitStrategy;
