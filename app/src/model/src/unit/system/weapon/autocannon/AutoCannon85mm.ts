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

class AutoCannon85mm extends Weapon {
  constructor({ id }: WeaponArgs, arcs: WeaponArcs) {
    super({ id, armor: 1, hitpoints: 6 }, [
      new RequiresPowerSystemStrategy(2),
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(20),
      new StandardRangeStrategy([
        { range: 0, modifier: 0 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.5), modifier: -20 },
        { range: MEDIUM_WEAPON_RANGE, modifier: -50 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 1.5), modifier: -200 },
      ]),
      new StandardLoadingStrategy(1),
      new BurstDamageStrategy(null, null, 0, 3, 10),
      new InterceptorStrategy(),
      new AmmunitionStrategy(["Ammo85mmAP", "Ammo85mmHE"], 3, 15, 6),
      new WeaponAnimationStrategy("UniversalBolt", {
        size: 8,
        speed: 0.5,
        color: [1.0, 0.7, 0.7],
        explosionSize: 5,
      }),
      new ArmorBoostOfflineSystemStrategy(3),
      new FireOrderHeatStrategy(8),
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
