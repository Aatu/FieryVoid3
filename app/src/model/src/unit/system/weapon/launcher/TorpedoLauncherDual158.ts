import { TorpedoLauncherStrategy } from "../../strategy/weapon/TorpedoLauncherStrategy";
import Weapon, { WeaponArgs } from "../Weapon";
import { Torpedo158Names } from "./TorpedoLauncher158";

class TorpedoLauncherDual158 extends Weapon {
  constructor(args: WeaponArgs) {
    super(args, [new TorpedoLauncherStrategy(Torpedo158Names, 2, 5, 5, 10)]);
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
