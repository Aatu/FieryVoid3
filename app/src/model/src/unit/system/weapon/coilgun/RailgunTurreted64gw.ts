import Weapon, { WeaponArgs } from "../Weapon";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy";
import WeaponArcStrategy, {
  WeaponArcs,
} from "../../strategy/weapon/WeaponArcStrategy";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy";
import WeaponAnimationStrategy from "../../strategy/weapon/WeaponAnimationStrategy";
import { UnifiedDamageSystemStrategy } from "../../strategy/weapon/UnifiedDamageStrategy";

class RailgunTurreted64gw extends Weapon {
  constructor(args: WeaponArgs, arcs: WeaponArcs) {
    super(args, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(35),
      new StandardRangeStrategy([
        { range: 0, modifier: -100 },
        { range: 10, modifier: 0 },
        { range: 300, modifier: -200 },
      ]),
      new StandardLoadingStrategy(4),
      new UnifiedDamageSystemStrategy({
        damageFormula: "6d3",
        armorPiercingFormula: "4d4",
        overPenetrationDamageMultiplier: { min: 0.2, max: 0.4 },
        damageArmorModifier: { min: 1.2, max: 1.4 },
      }),
      new WeaponAnimationStrategy("Bolt", {
        size: 18,
        length: 2000,
        speed: 6,
        color: [0.8, 0.1, 0.4],
      }),
    ]);
  }

  getDisplayName() {
    return "64Gw turreted railgun";
  }

  getBackgroundImage() {
    return "/img/system/matterCannon.png";
  }
}

export default RailgunTurreted64gw;
