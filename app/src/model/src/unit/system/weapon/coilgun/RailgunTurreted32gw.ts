import Weapon, { WeaponArgs } from "../Weapon.js";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy.js";
import WeaponArcStrategy, {
  WeaponArcs,
} from "../../strategy/weapon/WeaponArcStrategy.js";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy.js";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy.js";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy.js";
import WeaponAnimationStrategy from "../../strategy/weapon/WeaponAnimationStrategy.js";
import PiercingDamageStrategy from "../../strategy/weapon/PiercingDamageStrategy.js";

class RailgunTurreted32gw extends Weapon {
  constructor(args: WeaponArgs, arcs: WeaponArcs) {
    super(args, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(20),
      new StandardRangeStrategy([
        { range: 0, modifier: -100 },
        { range: 10, modifier: 0 },
        { range: 220, modifier: -200 },
      ]),
      new StandardLoadingStrategy(3),
      new PiercingDamageStrategy("4d3", "3d3 + 4"),
      new WeaponAnimationStrategy("Bolt", {
        size: 15,
        length: 2000,
        speed: 5,
        color: [0.8, 0.1, 0.4],
      }),
    ]);
  }

  getDisplayName() {
    return "32Gw turreted railgun";
  }

  getBackgroundImage() {
    return "/img/system/matterCannon.png";
  }
}

export default RailgunTurreted32gw;
