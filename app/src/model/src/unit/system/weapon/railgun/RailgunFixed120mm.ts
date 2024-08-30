import Weapon, { WeaponArgs } from "../Weapon";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy";
import WeaponArcStrategy, {
  WeaponArcs,
} from "../../strategy/weapon/WeaponArcStrategy";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy";
import WeaponAnimationStrategy from "../../strategy/weapon/WeaponAnimationStrategy";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy";
import BoostableSystemStrategy from "../../strategy/BoostableSystemStrategy";
import AmmunitionStrategy from "../../strategy/weapon/AmmunitionStrategy";
import OutputHeatOnlineStrategy from "../../strategy/OutputHeatOnlineStrategy";
import { MEDIUM_WEAPON_RANGE } from "../../../../config/gameConfig";
import { UnifiedDamageSystemStrategy } from "../../strategy/weapon/UnifiedDamageStrategy";

class RailgunFixed120mm extends Weapon {
  constructor({ id }: WeaponArgs, arcs: WeaponArcs) {
    super({ id, hitpoints: 8, armor: 4 }, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(18, 1, 2, 20),
      new StandardRangeStrategy([
        { range: 0, modifier: -100 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.5), modifier: -20 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 1.2), modifier: -50 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 2), modifier: -200 },
      ]),
      new StandardLoadingStrategy(3),
      new RequiresPowerSystemStrategy(4),
      new BoostableSystemStrategy(3, 1),
      new UnifiedDamageSystemStrategy(),
      new AmmunitionStrategy(["Ammo120mmAP", "Ammo120mmHE"], 1, 12, 4),
      new WeaponAnimationStrategy("UniversalBolt", {
        size: 13,
        length: 25,
        speed: 0.5,
        color: [1.0, 0.8, 0.4],
        explosionType: "gas",
        explosionSize: 12,
      }),
      new OutputHeatOnlineStrategy(3, 2),
    ]);
  }

  getDisplayName() {
    return "120mm fixed railgun";
  }

  getBackgroundImage() {
    return "/img/system/stdParticleBeam.png";
  }
}

export default RailgunFixed120mm;
