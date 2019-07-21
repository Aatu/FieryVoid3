import Weapon from "../Weapon.mjs";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy.mjs";
import WeaponArcStrategy from "../../strategy/weapon/WeaponArcStrategy.mjs";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy.mjs";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy.mjs";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy.mjs";
import StandardDamageStrategy from "../../strategy/weapon/StandardDamageStrategy.mjs";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.mjs";

class PDC30mm extends Weapon {
  constructor(args, arcs) {
    super(args, [
      new RequiresPowerSystemStrategy(1),
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(),
      new StandardRangeStrategy([
        { range: 0, modifier: 30 },
        { range: 3, modifier: 30 },
        { range: 5, modifier: 10 },
        { range: 10, modifier: -30 },
        { range: 15, modifier: -100 },
        { range: 18, modifier: -200 }
      ]),
      new StandardLoadingStrategy(1),
      new StandardDamageStrategy("d2", "d3+2")
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
