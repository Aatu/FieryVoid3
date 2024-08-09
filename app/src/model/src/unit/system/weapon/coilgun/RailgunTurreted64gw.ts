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
      new PiercingDamageStrategy("6d3", "4d4 + 4"),
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
