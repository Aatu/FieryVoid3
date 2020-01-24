import Weapon from "../Weapon.mjs";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.mjs";
import TorpedoLauncherStrategy from "../../strategy/weapon/TorpedoLauncherStrategy.mjs";
import Torpedo72 from "../ammunition/torpedo/Torpedo72.mjs";

class TorpedoLauncherDual72 extends Weapon {
  constructor(args) {
    super(args, [
      new TorpedoLauncherStrategy(1, null, Torpedo72, 3),
      new TorpedoLauncherStrategy(2, null, Torpedo72, 3)
    ]);
  }

  getDisplayName() {
    return "0.72m dual torpedo launcher";
  }

  getBackgroundImage() {
    return "/img/system/missile2.png";
  }

  getIconText() {
    return null;
  }
}

export default TorpedoLauncherDual72;
