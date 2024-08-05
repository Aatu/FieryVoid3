import Weapon from "../Weapon.mjs";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy.mjs";
import WeaponArcStrategy from "../../strategy/weapon/WeaponArcStrategy.mjs";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy.mjs";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy.mjs";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy.mjs";
import WeaponAnimationStrategy from "../../strategy/weapon/WeaponAnimationStrategy.mjs";
import PiercingDamageStrategy from "../../strategy/weapon/PiercingDamageStrategy.mjs";

class RailgunTurreted32gw extends Weapon {
  constructor(args, arcs) {
    super(args, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(20),
      new StandardRangeStrategy([
        { range: 0, modifier: -100 },
        { range: 10, modifier: 0 },
        { range: 220, modifier: -200 }
      ]),
      new StandardLoadingStrategy(3),
      new PiercingDamageStrategy("4d3", "3d3 + 4"),
      new WeaponAnimationStrategy("Bolt", {
        size: 15,
        length: 2000,
        speed: 5,
        color: [0.8, 0.1, 0.4]
      })
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
