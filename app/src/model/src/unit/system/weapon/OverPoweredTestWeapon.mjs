import Weapon from "./Weapon.mjs";
import FireOrderStrategy from "../strategy/weapon/FireOrderStrategy.mjs";
import WeaponArcStrategy from "../strategy/weapon/WeaponArcStrategy.js";
import StandardHitStrategy from "../strategy/weapon/StandardHitStrategy.mjs";
import StandardRangeStrategy from "../strategy/weapon/StandardRangeStrategy.mjs";
import StandardLoadingStrategy from "../strategy/weapon/StandardLoadingStrategy.mjs";
import StandardDamageStrategy from "../strategy/weapon/StandardDamageStrategy.mjs";

class OverPoweredTestWeapon extends Weapon {
  constructor(args, arcs) {
    super(args, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(10000),
      new StandardRangeStrategy([
        { range: 0, modifier: 0 },
        { range: 300, modifier: -200 },
      ]),
      new StandardLoadingStrategy(2),
      new StandardDamageStrategy(10000),
    ]);
  }
}

export default OverPoweredTestWeapon;
