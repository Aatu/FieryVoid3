import Weapon from "../Weapon.mjs";
import FireOrderStrategy from "../../strategy/weapon/FireOrderStrategy.mjs";
import WeaponArcStrategy from "../../strategy/weapon/WeaponArcStrategy.mjs";
import StandardHitStrategy from "../../strategy/weapon/StandardHitStrategy.mjs";
import StandardRangeStrategy from "../../strategy/weapon/StandardRangeStrategy.mjs";
import StandardLoadingStrategy from "../../strategy/weapon/StandardLoadingStrategy.mjs";
import WeaponAnimationStrategy from "../../strategy/weapon/WeaponAnimationStrategy.mjs";
import PiercingDamageStrategy from "../../strategy/weapon/PiercingDamageStrategy.mjs";
import BoostableSystemStrategy from "../../strategy/BoostableSystemStrategy.mjs";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.mjs";
import OutputHeatOnlineStrategy from "../../strategy/OutputHeatOnlineStrategy.mjs";

class MediumCoilcunTurretedUC extends Weapon {
  constructor({ id }, arcs) {
    super({ id, hitpoints: 14, armor: 5 }, [
      new FireOrderStrategy(1),
      new WeaponArcStrategy(arcs),
      new StandardHitStrategy(20),
      new StandardRangeStrategy([
        { range: 0, modifier: -200 },
        { range: 120, modifier: -20 },
        { range: 610, modifier: -200 }
      ]),
      new StandardLoadingStrategy(4),
      new RequiresPowerSystemStrategy(10),
      new BoostableSystemStrategy(8, 2),
      new PiercingDamageStrategy("d7+1", "d9+25"),
      new WeaponAnimationStrategy("UniversalBolt", {
        size: 12,
        length: 2000,
        speed: 5,
        color: [0.8, 0.1, 0.4],
        explosionSize: 20,
        explosionType: "gas"
      }),
      new OutputHeatOnlineStrategy(6, 2)
    ]);
  }

  getDisplayName() {
    return "Medium coilgun";
  }

  getBackgroundImage() {
    return "/img/system/matterCannon.png";
  }
}

export default MediumCoilcunTurretedUC;
