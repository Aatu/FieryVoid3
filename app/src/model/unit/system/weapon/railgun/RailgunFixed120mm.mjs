import Weapon from "../Weapon.mjs";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy.mjs";
import WeaponArcStrategy from "../../strategy/weapon/WeaponArcStrategy.mjs";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy.mjs";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy.mjs";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy.mjs";
import StandardDamageStrategy from "../../strategy/weapon/StandardDamageStrategy.mjs";
import WeaponAnimationStrategy from "../../strategy/weapon/WeaponAnimationStrategy.mjs";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.mjs";
import BoostableSystemStrategy from "../../strategy/BoostableSystemStrategy.mjs";

class RailgunFixed120mm extends Weapon {
  constructor(args, arcs) {
    super(args, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(10),
      new StandardRangeStrategy([
        { range: 0, modifier: -100 },
        { range: 20, modifier: 0 },
        { range: 100, modifier: -50 },
        { range: 200, modifier: -200 }
      ]),
      new StandardLoadingStrategy(2),
      new RequiresPowerSystemStrategy(4),
      new BoostableSystemStrategy(4, 1),
      new StandardDamageStrategy("2d4 + 10"),
      new WeaponAnimationStrategy("Bolt", {
        size: 6,
        length: 100,
        speed: 1.3,
        color: [1.0, 0.8, 0.4]
      })
    ]);
  }

  getDisplayName() {
    return "120mm fixed cannon";
  }

  getBackgroundImage() {
    return "/img/system/stdParticleBeam.png";
  }
}

export default RailgunFixed120mm;
