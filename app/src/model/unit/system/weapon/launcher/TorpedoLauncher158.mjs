import Weapon from "../Weapon.mjs";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.mjs";
import Torpedo158 from "../ammunition/torpedo/Torpedo158.mjs";
import TorpedoLauncherStrategy from "../../strategy/weapon/TorpedoLauncherStrategy.mjs";

class TorpedoLauncher158 extends Weapon {
  constructor(args) {
    super(args, [new TorpedoLauncherStrategy(1, null, Torpedo158, 10)]);
  }

  getDisplayName() {
    return "1.53m torpedo launcher";
  }

  getBackgroundImage() {
    return "/img/system/missile1.png";
  }

  getIconText() {
    return null;
  }
}

export default TorpedoLauncher158;
