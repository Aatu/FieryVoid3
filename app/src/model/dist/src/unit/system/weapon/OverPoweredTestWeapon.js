import Weapon from "./Weapon";
import FireOrderStrategy from "../strategy/weapon/FireOrderStrategy";
import WeaponArcStrategy from "../strategy/weapon/WeaponArcStrategy";
import StandardHitStrategy from "../strategy/weapon/StandardHitStrategy";
import StandardRangeStrategy from "../strategy/weapon/StandardRangeStrategy";
import StandardLoadingStrategy from "../strategy/weapon/StandardLoadingStrategy";
import { UnifiedDamageSystemStrategy } from "../strategy/weapon/UnifiedDamageStrategy";
class OverPoweredTestWeapon extends Weapon {
    constructor(args, arcs) {
        super(args, [
            new FireOrderStrategy(1),
            new WeaponArcStrategy(arcs),
            new StandardHitStrategy(10000, 100),
            new StandardRangeStrategy([
                { range: 0, modifier: 0 },
                { range: 300, modifier: -200 },
            ]),
            new StandardLoadingStrategy(2),
            new UnifiedDamageSystemStrategy({
                damageFormula: 10000,
                armorPiercingFormula: 1000,
            }),
        ]);
    }
}
export default OverPoweredTestWeapon;
