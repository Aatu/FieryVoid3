import Weapon from "./Weapon.mjs";
import FireOrderStrategy from "../strategy/weapon/FireOrderStrategy.mjs";
import WeaponArcStrategy from "../strategy/weapon/WeaponArcStrategy.mjs";
import StandardHitStrategy from "../strategy/weapon/StandardHitStrategy.mjs";
import StandardRangeStrategy from "../strategy/weapon/StandardRangeStrategy.mjs";
import StandardLoadingStrategy from "../strategy/weapon/StandardLoadingStrategy.mjs";
import TestDamageStrategy from "../strategy/weapon/TestDamageStrategy.mjs";

class TestWeapon extends Weapon {
  constructor(args, arcs) {
    super(args, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(),
      new StandardRangeStrategy([
        { range: 0, modifier: 100000 },
        { range: 300, modifier: 100000 }
      ]),
      new StandardLoadingStrategy(1),
      new TestDamageStrategy(10)
    ]);
  }
}

export default TestWeapon;
