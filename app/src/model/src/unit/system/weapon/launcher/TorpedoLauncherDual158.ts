import Weapon, { WeaponArgs } from "../Weapon.js";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.js";
import Torpedo158 from "../ammunition/torpedo/Torpedo158.js";
import TorpedoLauncherStrategy from "../../strategy/weapon/TorpedoLauncherStrategy.js";

class TorpedoLauncherDual158 extends Weapon {
  constructor(args: WeaponArgs) {
    super(args, [
      new TorpedoLauncherStrategy(1, null, Torpedo158, 10),
      new TorpedoLauncherStrategy(2, null, Torpedo158, 10),
    ]);
  }

  getDisplayName() {
    return "1.53m dual torpedo launcher";
  }

  getBackgroundImage() {
    return "/img/system/missile2.png";
  }

  getIconText() {
    return "";
  }
}

export default TorpedoLauncherDual158;
