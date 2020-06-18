import Weapon from "../Weapon.mjs";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.mjs";
import Torpedo158 from "../ammunition/torpedo/Torpedo158.mjs";
import TorpedoLauncherStrategy from "../../strategy/weapon/TorpedoLauncherStrategy.mjs";

class TorpedoLauncherDual158 extends Weapon {
  constructor(args) {
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
    return null;
  }
}

export default TorpedoLauncherDual158;
