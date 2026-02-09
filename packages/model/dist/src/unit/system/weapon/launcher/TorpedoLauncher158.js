import { TorpedoLauncherStrategy } from "../../strategy/weapon/TorpedoLauncherStrategy";
import Weapon from "../Weapon";
export const Torpedo158Names = [
    "Torpedo158Nuclear",
    "Torpedo158HE",
    "Torpedo158MSV",
];
class TorpedoLauncher158 extends Weapon {
    constructor(args) {
        super(args, [new TorpedoLauncherStrategy(Torpedo158Names, 1, 3, 2, 6)]);
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
