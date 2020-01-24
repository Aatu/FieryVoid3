import Weapon from "../Weapon.mjs";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy.mjs";
import WeaponArcStrategy from "../../strategy/weapon/WeaponArcStrategy.mjs";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy.mjs";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy.mjs";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy.mjs";
import StandardDamageStrategy from "../../strategy/weapon/StandardDamageStrategy.mjs";
import WeaponAnimationStrategy from "../../strategy/weapon/WeaponAnimationStrategy.mjs";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.mjs";
import BoostableSystemStrategy from "../../strategy/BoostableSystemStrategy.mjs";
import Ammo140mmAP from "../ammunition/conventional/Ammo140mmAP.mjs";
import Ammo140mmHE from "../ammunition/conventional/Ammo140mmHE.mjs";
import AmmunitionStrategy from "../../strategy/weapon/AmmunitionStrategy.mjs";
import OutputHeatOnlineStrategy from "../../strategy/OutputHeatOnlineStrategy.mjs";

class RailgunTurreted140mmUC extends Weapon {
  constructor({ id }, arcs) {
    super({ id, hitpoints: 9, armor: 3 }, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(15),
      new StandardRangeStrategy([
        { range: 0, modifier: -50 },
        { range: 10, modifier: 0 },
        { range: 250, modifier: -200 }
      ]),
      new StandardLoadingStrategy(3),
      new RequiresPowerSystemStrategy(4),
      new BoostableSystemStrategy(5, 2),
      new StandardDamageStrategy(),
      new AmmunitionStrategy([Ammo140mmAP, Ammo140mmHE], 1, 9, 4),
      new WeaponAnimationStrategy("UniversalBolt", {
        size: 6,
        length: 100,
        speed: 1.3,
        color: [1.0, 0.8, 0.4]
      }),
      new OutputHeatOnlineStrategy(3, 2)
    ]);
  }

  getDisplayName() {
    return "140mm railgun";
  }

  getBackgroundImage() {
    return "/img/system/turretMedium1.png";
  }
}

export default RailgunTurreted140mmUC;
