import Weapon from "../Weapon.mjs";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy.mjs";
import WeaponArcStrategy from "../../strategy/weapon/WeaponArcStrategy.mjs";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy.mjs";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy.mjs";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy.mjs";
import StandardDamageStrategy from "../../strategy/weapon/StandardDamageStrategy.mjs";

class CannonFixed120mm extends Weapon {
  constructor(args, arcs) {
    super(args, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(1),
      new StandardRangeStrategy([
        { range: 0, modifier: -10 },
        { range: 3, modifier: 0 },
        { range: 6, modifier: 20 },
        { range: 50, modifier: -200 }
      ]),
      new StandardLoadingStrategy(1),
      new StandardDamageStrategy("2d4 + 10")
    ]);
  }

  getDisplayName() {
    return "120mm fixed cannon";
  }

  getBackgroundImage() {
    return "/img/system/stdParticleBeam.png";
  }
}

export default CannonFixed120mm;
