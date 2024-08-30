import Weapon, { WeaponArgs } from "../Weapon";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy";
import WeaponArcStrategy, {
  WeaponArcs,
} from "../../strategy/weapon/WeaponArcStrategy";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy";
import WeaponAnimationStrategy from "../../strategy/weapon/WeaponAnimationStrategy";
import InterceptorStrategy from "../../strategy/weapon/InterceptorStrategy";
import AmmunitionStrategy from "../../strategy/weapon/AmmunitionStrategy";
import { MEDIUM_WEAPON_RANGE } from "../../../../config/gameConfig";
import { UnifiedDamageSystemStrategy } from "../../strategy/weapon/UnifiedDamageStrategy";

class X2PDC30mm extends Weapon {
  constructor(args: WeaponArgs, arcs: WeaponArcs) {
    super(args, [
      new RequiresPowerSystemStrategy(2),
      new FireOrderStrategy(),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(30, 12, 6, 5),
      new StandardRangeStrategy([
        { range: 0, modifier: 0 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.3), modifier: -20 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.5), modifier: -50 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.6), modifier: -100 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.8), modifier: -200 },
      ]),
      new StandardLoadingStrategy(1),
      new UnifiedDamageSystemStrategy(),
      new InterceptorStrategy(),
      new AmmunitionStrategy(["Ammo30mm"], 6, 36, 12),
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
