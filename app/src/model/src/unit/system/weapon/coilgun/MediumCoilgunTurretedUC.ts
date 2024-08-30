import Weapon, { WeaponArgs } from "../Weapon";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy";
import WeaponArcStrategy, {
  WeaponArcs,
} from "../../strategy/weapon/WeaponArcStrategy";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy";
import WeaponAnimationStrategy from "../../strategy/weapon/WeaponAnimationStrategy";
import BoostableSystemStrategy from "../../strategy/BoostableSystemStrategy";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy";
import OutputHeatOnlineStrategy from "../../strategy/OutputHeatOnlineStrategy";
import { MEDIUM_WEAPON_RANGE } from "../../../../config/gameConfig";
import { UnifiedDamageSystemStrategy } from "../../strategy/weapon/UnifiedDamageStrategy";

class MediumCoilgunTurretedUC extends Weapon {
  constructor({ id }: WeaponArgs, arcs: WeaponArcs) {
    super({ id, hitpoints: 14, armor: 5 }, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(20),
      new StandardRangeStrategy([
        { range: 0, modifier: -200 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 1.6), modifier: -20 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 2), modifier: -40 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 2.5), modifier: -60 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 4), modifier: -200 },
      ]),
      new StandardLoadingStrategy(4),
      new RequiresPowerSystemStrategy(10),
      new BoostableSystemStrategy(8, 2),
      new UnifiedDamageSystemStrategy({
        damageFormula: "d7+1",
        armorPiercingFormula: "d9+25",
        overPenetrationDamageMultiplier: { min: 0.2, max: 0.4 },
        damageArmorModifier: { min: 1.2, max: 1.4 },
      }),
      new WeaponAnimationStrategy("UniversalBolt", {
        size: 12,
        length: 2000,
        speed: 5,
        color: [0.8, 0.1, 0.4],
        explosionSize: 20,
        explosionType: "gas",
      }),
      new OutputHeatOnlineStrategy(6, 2),
    ]);
  }

  getDisplayName() {
    return "Medium coilgun";
  }

  getBackgroundImage() {
    return "/img/system/matterCannon.png";
  }
}

export default MediumCoilgunTurretedUC;
