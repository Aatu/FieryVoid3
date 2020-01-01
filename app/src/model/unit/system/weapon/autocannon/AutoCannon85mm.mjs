import Weapon from "../Weapon.mjs";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy.mjs";
import WeaponArcStrategy from "../../strategy/weapon/WeaponArcStrategy.mjs";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy.mjs";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy.mjs";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy.mjs";
import BurstDamageStrategy from "../../strategy/weapon/BurstDamageStrategy.mjs";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.mjs";
import WeaponAnimationStrategy from "../../strategy/weapon/WeaponAnimationStrategy.mjs";
import InterceptorStrategy from "../../strategy/weapon/InterceptorStrategy.mjs";
import AmmunitionStrategy from "../../strategy/weapon/AmmunitionStrategy.mjs";
import { Ammo85mmAP, Ammo85mmHE } from "../ammunition/conventional/index.mjs";

class AutoCannon85mm extends Weapon {
  constructor(args, arcs) {
    super(args, [
      new RequiresPowerSystemStrategy(2),
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(20),
      new StandardRangeStrategy([
        { range: 0, modifier: 0 },
        { range: 3, modifier: -5 },
        { range: 15, modifier: -20 },
        { range: 20, modifier: -50 },
        { range: 25, modifier: -100 },
        { range: 35, modifier: -200 }
      ]),
      new StandardLoadingStrategy(1),
      new BurstDamageStrategy("2d4+2", 0, 0, 3, 10),
      new InterceptorStrategy(),
      new AmmunitionStrategy([Ammo85mmAP, Ammo85mmHE], 3, 15, 6),
      new WeaponAnimationStrategy("BoltBurst", {
        size: 8,
        speed: 0.5,
        color: [1.0, 0.7, 0.7],
        explosionSize: 5
      })
    ]);
  }

  getDisplayName() {
    return "85mm Autocannon";
  }

  getBackgroundImage() {
    return "/img/system/lightParticleBeamShip.png";
  }
}

export default AutoCannon85mm;
