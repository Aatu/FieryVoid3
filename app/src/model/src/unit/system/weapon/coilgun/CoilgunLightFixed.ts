import Weapon from "../Weapon";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy";
import WeaponArcStrategy, {
  WeaponArc,
} from "../../strategy/weapon/WeaponArcStrategy";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy";
import WeaponAnimationStrategy from "../../strategy/weapon/WeaponAnimationStrategy";
import PiercingDamageStrategy from "../../strategy/weapon/PiercingDamageStrategy";
import BoostableSystemStrategy from "../../strategy/BoostableSystemStrategy";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy";
import OutputHeatOnlineStrategy from "../../strategy/OutputHeatOnlineStrategy";
import { SystemArgs } from "../../ShipSystem";
import { MEDIUM_WEAPON_RANGE } from "../../../../config/gameConfig";

class CoilgunLightFixed extends Weapon {
  constructor({ id }: SystemArgs, arcs: WeaponArc | WeaponArc[]) {
    super({ id, hitpoints: 10, armor: 5 }, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(20),
      new StandardRangeStrategy([
        { range: 0, modifier: -100 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 1.5), modifier: -20 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 2), modifier: -40 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 3), modifier: -200 },
      ]),
      new StandardLoadingStrategy(4),
      new RequiresPowerSystemStrategy(6),
      new BoostableSystemStrategy(6, 2),
      new PiercingDamageStrategy("d7+1", "d6+20"),
      new WeaponAnimationStrategy("UniversalBolt", {
        size: 12,
        length: 2000,
        speed: 5,
        color: [0.8, 0.1, 0.4],
        explosionSize: 20,
        explosionType: "gas",
      }),
      new OutputHeatOnlineStrategy(4, 2),
    ]);
  }

  getDisplayName() {
    return "Fixed light coilgun";
  }

  getBackgroundImage() {
    return "/img/system/matterCannon.png";
  }
}

export default CoilgunLightFixed;
