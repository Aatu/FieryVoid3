import Weapon, { WeaponArgs } from "../Weapon";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy";
import Torpedo158 from "../ammunition/torpedo/Torpedo158";
import TorpedoLauncherStrategy from "../../strategy/weapon/TorpedoLauncherStrategy";

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
