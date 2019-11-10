import Weapon from "../Weapon.mjs";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy.mjs";
import WeaponArcStrategy from "../../strategy/weapon/WeaponArcStrategy.mjs";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy.mjs";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy.mjs";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy.mjs";
import BurstDamageStrategy from "../../strategy/weapon/BurstDamageStrategy.mjs";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.mjs";
import WeaponAnimationStrategy from "../../strategy/weapon/WeaponAnimationStrategy.mjs";

class PDC30mm extends Weapon {
  constructor(args, arcs) {
    super(args, [
      new RequiresPowerSystemStrategy(1),
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(30),
      new StandardRangeStrategy([
        { range: 0, modifier: 0 },
        { range: 3, modifier: 0 },
        { range: 10, modifier: -20 },
        { range: 15, modifier: -50 },
        { range: 18, modifier: -100 },
        { range: 20, modifier: -200 }
      ]),
      new StandardLoadingStrategy(1),
      new BurstDamageStrategy("d2", "d3+2", "d6", 6, 5),
      new WeaponAnimationStrategy("BoltBurst", {
        size: 6,
        speed: 0.35,
        color: [1.0, 0.8, 0.4],
        shots: 6
      })
    ]);
  }

  getDisplayName() {
    return "30mm PDC";
  }

  getBackgroundImage() {
    return "/img/system/gatlingPulseCannon.png";
  }
}

export default PDC30mm;
