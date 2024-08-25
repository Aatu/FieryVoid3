import Weapon, { WeaponArgs } from "../Weapon";
import Torpedo158 from "../ammunition/torpedo/Torpedo158";
import TorpedoLauncherStrategy from "../../strategy/weapon/TorpedoLauncherStrategy";

class TorpedoLauncher158 extends Weapon {
  constructor(args: WeaponArgs) {
    super(args, [new TorpedoLauncherStrategy(1, null, Torpedo158, 10)]);
  }

  getDisplayName() {
    return "1.53m torpedo launcher";
  }

  getBackgroundImage() {
    return "/img/system/missile1.png";
  }

  getIconText() {
    return "";
  }
}

export default TorpedoLauncher158;
