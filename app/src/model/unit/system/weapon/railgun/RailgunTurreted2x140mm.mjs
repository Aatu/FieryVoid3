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
import Ammo140mmAP from "../ammunition/conventional/Ammo140mmAP.mjs";
import Ammo140mmHE from "../ammunition/conventional/Ammo140mmHE.mjs";
import AmmunitionStrategy from "../../strategy/weapon/AmmunitionStrategy.mjs";

class RailgunTurreted2x140mm extends Weapon {
  constructor(args, arcs) {
    super(args, [
      new FireOrderStrategy(2),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(10),
      new StandardRangeStrategy([
        { range: 0, modifier: -50 },
        { range: 10, modifier: 0 },
        { range: 200, modifier: -200 }
      ]),
      new StandardLoadingStrategy(2),
      new RequiresPowerSystemStrategy(6),
      new BoostableSystemStrategy(6, 1),
      new StandardDamageStrategy("2d5 + 10"),
      new AmmunitionStrategy([Ammo140mmAP, Ammo140mmHE], 1, 9, 4),
      new WeaponAnimationStrategy("Bolt", {
        size: 6,
        length: 100,
        speed: 1.3,
        color: [1.0, 0.8, 0.4]
      })
    ]);
  }

  getDisplayName() {
    return "2x140mm turreted railgun";
  }

  getBackgroundImage() {
    return "/img/system/twinArray.png";
  }
}

export default RailgunTurreted2x140mm;