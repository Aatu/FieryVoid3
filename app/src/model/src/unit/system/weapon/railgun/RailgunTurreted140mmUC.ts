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

class RailgunTurreted140mmUC extends Weapon {
  constructor({ id }: WeaponArgs, arcs: WeaponArcs) {
    super({ id, hitpoints: 9, armor: 3 }, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(25, 1, 3, 15),
      new StandardRangeStrategy([
        { range: 0, modifier: -50 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.2), modifier: -20 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 1.6), modifier: -70 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 2.4), modifier: -200 },
      ]),
      new StandardLoadingStrategy(3),
      new RequiresPowerSystemStrategy(4),
      new BoostableSystemStrategy(5, 2),
      new UnifiedDamageSystemStrategy(),
      new AmmunitionStrategy(["Ammo140mmAP", "Ammo140mmHE"], 1, 9, 4),
      new WeaponAnimationStrategy("UniversalBolt", {
        size: 15,
        length: 30,
        speed: 0.6,
        color: [1.0, 0.8, 0.4],
        explosionType: "gas",
      }),
      new OutputHeatOnlineStrategy(3, 2),
    ]);
  }

  getDisplayName() {
    return "140mm railgun";
  }

  getBackgroundImage() {
    return "/img/system/turretMedium1.png";
  }
}

export default RailgunTurreted140mmUC;
