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
import { Ammo30mm } from "../ammunition/conventional/index.mjs";
import AmmunitionStrategy from "../../strategy/weapon/AmmunitionStrategy.mjs";
import { MEDIUM_WEAPON_RANGE } from "../../../../gameConfig.mjs";

class X2PDC30mm extends Weapon {
  constructor(args, arcs) {
    super(args, [
      new RequiresPowerSystemStrategy(2),
      new FireOrderStrategy(2),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(30),
      new StandardRangeStrategy([
        { range: 0, modifier: 0 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.3), modifier: -20 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.5), modifier: -50 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.6), modifier: -100 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.8), modifier: -200 },
      ]),
      new StandardLoadingStrategy(1),
      new BurstDamageStrategy("d2", "d3+2", 0, 6, 5),
      new InterceptorStrategy(2),
      new AmmunitionStrategy([Ammo30mm], 6, 36, 12),
      new WeaponAnimationStrategy("UniversalBolt", {
        size: 6,
        speed: 0.35,
        color: [1.0, 0.8, 0.4],
        shots: 6,
      }),
    ]);
  }

  getDisplayName() {
    return "2x30mm PDC";
  }

  getBackgroundImage() {
    return "/img/system/gatlingPulseCannon.png";
  }
}

export default X2PDC30mm;
