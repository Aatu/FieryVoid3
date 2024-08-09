import Weapon, { WeaponArgs } from "../Weapon.js";
import RequiresPowerSystemStrategy from "../../strategy/RequiresPowerSystemStrategy.js";
import TorpedoLauncherStrategy from "../../strategy/weapon/TorpedoLauncherStrategy.js";
import Torpedo72 from "../ammunition/torpedo/Torpedo72.js";

class TorpedoLauncherDual72 extends Weapon {
  constructor(args: WeaponArgs) {
    super(args, [
      new TorpedoLauncherStrategy(1, null, Torpedo72, 8),
      new TorpedoLauncherStrategy(2, null, Torpedo72, 8),
    ]);
  }

  getDisplayName() {
    return "0.72m dual torpedo launcher";
  }

  getBackgroundImage() {
    return "/img/system/missile2.png";
  }

  getIconText() {
    return "";
  }
}

export default TorpedoLauncherDual72;
