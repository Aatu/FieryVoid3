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
import BurstDamageStrategy from "../../strategy/weapon/BurstDamageStrategy.mjs";
import { MEDIUM_WEAPON_RANGE } from "../../../../gameConfig.mjs";

class RailgunTurreted2x140mm extends Weapon {
  constructor({ id }, arcs) {
    super({ id, hitpoints: 12, armor: 3 }, [
      new FireOrderStrategy(2),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(25),
      new StandardRangeStrategy([
        { range: 0, modifier: -50 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 0.2), modifier: -20 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 1.4), modifier: -70 },
        { range: Math.round(MEDIUM_WEAPON_RANGE * 2.2), modifier: -200 },
      ]),
      new StandardLoadingStrategy(3),
      new RequiresPowerSystemStrategy(6),
      new BoostableSystemStrategy(6, 1),
      new BurstDamageStrategy(null, null, 0, 3, 20),
      new AmmunitionStrategy([Ammo140mmAP, Ammo140mmHE], 1, 9, 4),
      new WeaponAnimationStrategy("UniversalBolt", {
        size: 13,
        length: 30,
        speed: 0.5,
        color: [1.0, 0.8, 0.4],
        explosionType: "gas",
      }),
      new OutputHeatOnlineStrategy(5, 3),
    ]);
  }

  getDisplayName() {
    return "2x140mm railgun";
  }

  getBackgroundImage() {
    return "/img/system/twinArray.png";
  }
}

export default RailgunTurreted2x140mm;
