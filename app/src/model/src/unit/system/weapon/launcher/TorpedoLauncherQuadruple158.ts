import Weapon, { WeaponArgs } from "../Weapon.js";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.js";
import Torpedo158 from "../ammunition/torpedo/Torpedo158.js";
import TorpedoLauncherStrategy from "../../strategy/weapon/TorpedoLauncherStrategy.js";

class TorpedoLauncherQuadruple158 extends Weapon {
  constructor(args: WeaponArgs) {
    super(args, [
      new TorpedoLauncherStrategy(1, null, Torpedo158, 12),
      new TorpedoLauncherStrategy(2, null, Torpedo158, 12),
      new TorpedoLauncherStrategy(3, null, Torpedo158, 12),
      new TorpedoLauncherStrategy(4, null, Torpedo158, 12),
    ]);
  }

  getDisplayName() {
    return "4x 1.53m torpedo launcher";
  }

  getBackgroundImage() {
    return "/img/system/missile4.png";
  }

  getIconText() {
    return "";
  }
}

export default TorpedoLauncherQuadruple158;