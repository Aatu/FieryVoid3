import Weapon, { WeaponArgs } from "../Weapon.js";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy.js";
import WeaponArcStrategy, {
  WeaponArcs,
} from "../../strategy/weapon/WeaponArcStrategy.js";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy.js";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy.js";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy.js";
import BurstDamageStrategy from "../../strategy/weapon/BurstDamageStrategy.js";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.js";
import WeaponAnimationStrategy from "../../strategy/weapon/WeaponAnimationStrategy.js";
import InterceptorStrategy from "../../strategy/weapon/InterceptorStrategy.js";
import AmmunitionStrategy from "../../strategy/weapon/AmmunitionStrategy.js";
import ArmorBoostOfflineSystemStrategy from "../../strategy/ArmorBoostOfflineSystemStrategy.js";
import FireOrderHeatStrategy from "../../strategy/FireOrderHeatStrategy.js";
import { MEDIUM_WEAPON_RANGE } from "../../../../config/gameConfig.js";

class PDC30mm extends Weapon {
  constructor({ id }: WeaponArgs, arcs: WeaponArcs) {
    super({ id, armor: 1, hitpoints: 4 }, [
      new RequiresPowerSystemStrategy(1),
      new FireOrderStrategy(1),
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
      new BurstDamageStrategy(null, null, 0, 6, 5),
      new InterceptorStrategy(1, 2),
      new AmmunitionStrategy(["Ammo30mm"], 6, 24, 12),
      new WeaponAnimationStrategy("UniversalBolt", {
        size: 6,
        speed: 0.35,
        color: [1.0, 0.9, 0.8],
        explosionSize: 3,
      }),
      new ArmorBoostOfflineSystemStrategy(3),
      new FireOrderHeatStrategy(3),
    ]);
  }

  getDisplayName() {
    return "30mm PDC";
  }

  getBackgroundImage() {
    return "/img/system/gatlingPulseCannon.png";
  }

  getSystemDescription() {
    return "Fast tracking 30mm rotary autocannon for point defense. Uses conventional bullets with chemical propellant.";
  }
}

export default PDC30mm;
