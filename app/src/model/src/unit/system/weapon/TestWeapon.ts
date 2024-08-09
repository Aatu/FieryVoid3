import Weapon, { WeaponArgs } from "./Weapon";
import FireOrderStrategy from "../strategy/weapon/FireOrderStrategy";
import WeaponArcStrategy, {
  WeaponArcs,
} from "../strategy/weapon/WeaponArcStrategy.js";
import StandardHitStrategy from "../strategy/weapon/StandardHitStrategy";
import StandardRangeStrategy from "../strategy/weapon/StandardRangeStrategy";
import StandardLoadingStrategy from "../strategy/weapon/StandardLoadingStrategy";
import TestDamageStrategy from "../strategy/weapon/TestDamageStrategy";

class TestWeapon extends Weapon {
  constructor(args: WeaponArgs, arcs: WeaponArcs) {
    super(args, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(10000),
      new StandardRangeStrategy([
        { range: 0, modifier: 0 },
        { range: 300, modifier: -200 },
      ]),
      new StandardLoadingStrategy(2),
      new TestDamageStrategy(10),
    ]);
  }
}

export default TestWeapon;
