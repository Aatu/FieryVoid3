import { TorpedoType } from "../ammunition";
import Weapon, { WeaponArgs } from "../Weapon";
export declare const Torpedo158Names: TorpedoType[];
declare class TorpedoLauncher158 extends Weapon {
    constructor(args: WeaponArgs);
    getDisplayName(): string;
    getBackgroundImage(): string;
    getIconText(): string;
}
export default TorpedoLauncher158;
