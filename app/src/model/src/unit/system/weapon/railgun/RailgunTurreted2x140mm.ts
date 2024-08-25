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
import BurstDamageStrategy from "../../strategy/weapon/BurstDamageStrategy";
import { MEDIUM_WEAPON_RANGE } from "../../../../config/gameConfig";

class RailgunTurreted2x140mm extends Weapon {
  constructor({ id }: WeaponArgs, arcs: WeaponArcs) {
    super({ id, hitpoints: 12, armor: 3 }, [
      new FireOrderStrategy(2),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(25),
      new StandardRangeStrategy([
        { range: 0, modifier: -50 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.2), modifier: -20 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 1.4), modifier: -70 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 2.2), modifier: -200 },
      ]),
      new StandardLoadingStrategy(3),
      new RequiresPowerSystemStrategy(6),
      new BoostableSystemStrategy(6, 1),
      new BurstDamageStrategy(null, null, 0, 3, 20),
      new AmmunitionStrategy(["Ammo140mmAP", "Ammo140mmHE"], 1, 9, 4),
      new WeaponAnimationStrategy("UniversalBolt", {
        size: 13,
        length: 30,
        speed: 0.5,
        color: [1.0, 0.8, 0.4],
        explosionType: "gas",
      }),
      new OutputHeatOnlineStrategy(5, 3),
    ]);
  }

  getDisplayName() {
    return "2x140mm railgun";
  }

  getBackgroundImage() {
    return "/img/system/twinArray.png";
  }
}

export default RailgunTurreted2x140mm;
