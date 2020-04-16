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
import { Ammo120mmHE, Ammo120mmAP } from "../ammunition/conventional/index.mjs";
import AmmunitionStrategy from "../../strategy/weapon/AmmunitionStrategy.mjs";
import OutputHeatOnlineStrategy from "../../strategy/OutputHeatOnlineStrategy.mjs";
import BurstDamageStrategy from "../../strategy/weapon/BurstDamageStrategy.mjs";

class RailgunFixed120mm extends Weapon {
  constructor({ id }, arcs) {
    super({ id, hitpoints: 8, armor: 4 }, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(10),
      new StandardRangeStrategy([
        { range: 0, modifier: -100 },
        { range: 30, modifier: 0 },
        { range: 190, modifier: -200 },
      ]),
      new StandardLoadingStrategy(3),
      new RequiresPowerSystemStrategy(4),
      new BoostableSystemStrategy(3, 1),
      new BurstDamageStrategy(null, null, 0, 2, 20),
      new AmmunitionStrategy([Ammo120mmAP, Ammo120mmHE], 1, 12, 4),
      new WeaponAnimationStrategy("UniversalBolt", {
        size: 13,
        length: 25,
        speed: 0.5,
        color: [1.0, 0.8, 0.4],
        explosionType: "gas",
        explosionSize: 12,
      }),
      new OutputHeatOnlineStrategy(3, 2),
    ]);
  }

  getDisplayName() {
    return "120mm fixed railgun";
  }

  getBackgroundImage() {
    return "/img/system/stdParticleBeam.png";
  }
}

export default RailgunFixed120mm;
