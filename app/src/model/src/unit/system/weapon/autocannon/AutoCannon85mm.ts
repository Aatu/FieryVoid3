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
import InternalSystemWhenOfflineSystemStrategy from "../../strategy/InternalSystemWhenOfflineSystemStrategy";
import FireOrderHeatStrategy from "../../strategy/FireOrderHeatStrategy";
import { MEDIUM_WEAPON_RANGE } from "../../../../config/gameConfig";
import { UnifiedDamageSystemStrategy } from "../../strategy/weapon/UnifiedDamageStrategy";
import { AmmoMagazineSystemStrategy } from "../../strategy/AmmoMagazineSystemStrategy";

class AutoCannon85mm extends Weapon {
  constructor({ id }: WeaponArgs, arcs: WeaponArcs) {
    super({ id, armor: 1, hitpoints: 6 }, [
      new RequiresPowerSystemStrategy(2),
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(20, 3, 2, 15),
      new StandardRangeStrategy([
        { range: 0, modifier: 0 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.5), modifier: -20 },
        { range: MEDIUM_WEAPON_RANGE, modifier: -50 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 1.5), modifier: -200 },
      ]),
      new StandardLoadingStrategy(1),
      new UnifiedDamageSystemStrategy(),
      new InterceptorStrategy(),
      new AmmunitionStrategy(["Ammo85mmAP", "Ammo85mmHE"], 2),
      new AmmoMagazineSystemStrategy({ Ammo85mmAP: 4, Ammo85mmHE: 10 }, 3),
      new WeaponAnimationStrategy("UniversalBolt", {
        size: 8,
        speed: 0.5,
        color: [1.0, 0.7, 0.7],
        explosionSize: 5,
      }),
      new InternalSystemWhenOfflineSystemStrategy(3),
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
