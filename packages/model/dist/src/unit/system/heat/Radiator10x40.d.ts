import { SystemArgs } from "../ShipSystem";
import Radiator from "./Radiator";
declare class Radiator10x40 extends Radiator {
    constructor({ id }: SystemArgs);
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default Radiator10x40;
