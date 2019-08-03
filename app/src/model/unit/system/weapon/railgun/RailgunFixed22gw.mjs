import Weapon from "../Weapon.mjs";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy.mjs";
import WeaponArcStrategy from "../../strategy/weapon/WeaponArcStrategy.mjs";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy.mjs";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy.mjs";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy.mjs";
import StandardDamageStrategy from "../../strategy/weapon/StandardDamageStrategy.mjs";

class RailgunFixed22gw extends Weapon {
  constructor(args, arcs) {
    super(args, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(1),
      new StandardRangeStrategy([
        { range: 0, modifier: -30 },
        { range: 10, modifier: 20 },
        { range: 50, modifier: -100 },
        { range: 100, modifier: -200 }
      ]),
      new StandardLoadingStrategy(3),
      new StandardDamageStrategy("3d3", "2d2 + 4")
    ]);
  }

  getDisplayName() {
    return "22Gw fixed railgun";
  }

  getBackgroundImage() {
    return "/img/system/matterCannon.png";
  }
}

export default RailgunFixed22gw;
