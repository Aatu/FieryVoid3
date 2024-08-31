import { AmmoMagazineSystemStrategy } from "../../strategy/AmmoMagazineSystemStrategy";
import { TorpedoLauncherStrategy } from "../../strategy/weapon/TorpedoLauncherStrategy";
import { TorpedoType } from "../ammunition/torpedo";
import Weapon, { WeaponArgs } from "../Weapon";

export const Torpedo158Names: TorpedoType[] = [
  "Torpedo158Nuclear",
  "Torpedo158HE",
  "Torpedo158MSV",
];

class TorpedoLauncher158 extends Weapon {
  constructor(args: WeaponArgs) {
    super(args, [
      new TorpedoLauncherStrategy(Torpedo158Names, 1, 3),
      new AmmoMagazineSystemStrategy({ Torpedo158HE: 1, Torpedo158MSV: 2 }, 3),
    ]);
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
