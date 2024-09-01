import { TorpedoLauncherStrategy } from "../../strategy/weapon/TorpedoLauncherStrategy";
import Weapon, { WeaponArgs } from "../Weapon";
import { Torpedo158Names } from "./TorpedoLauncher158";

class TorpedoLauncherQuadruple158 extends Weapon {
  constructor(args: WeaponArgs) {
    super(args, [new TorpedoLauncherStrategy(Torpedo158Names, 4, 5, 12, 15)]);
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
