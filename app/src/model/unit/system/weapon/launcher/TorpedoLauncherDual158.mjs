import Weapon from "../Weapon.mjs";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.mjs";
import Torpedo158 from "../ammunition/torpedo/Torpedo158.mjs";
import Torpedo158MSV from "../ammunition/torpedo/Torpedo158MSV.mjs";
import Torpedo158Nuclear from "../ammunition/torpedo/Torpedo158Nuclear.mjs";
import TorpedoLauncherStrategy from "../../strategy/weapon/TorpedoLauncherStrategy.mjs";
import LaunchTorpedoStrategy from "../../strategy/weapon/LaunchTorpedoStrategy.mjs";

class TorpedoLauncherDual158 extends Weapon {
  constructor(args) {
    super(args, [
      new RequiresPowerSystemStrategy(1),
      new TorpedoLauncherStrategy(1, null, Torpedo158, 3),
      new TorpedoLauncherStrategy(2, null, Torpedo158, 3)
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
