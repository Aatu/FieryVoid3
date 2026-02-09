import { TorpedoLauncherStrategy } from "../../strategy/weapon/TorpedoLauncherStrategy";
import Weapon from "../Weapon";
class TorpedoLauncherDual72 extends Weapon {
    constructor(args) {
        super(args, [
            new TorpedoLauncherStrategy(["Torpedo72MSV", "Torpedo72HE"], 2, 5, 5, 10),
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
