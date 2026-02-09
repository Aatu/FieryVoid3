import ShipSystemStrategy from "../ShipSystemStrategy";
import { IVector } from "../../../../utils/Vector";
import Ship from "../../../Ship";
export type WeaponArc = {
    start: number;
    end: number;
};
export type WeaponArcs = WeaponArc | WeaponArc[];
declare class WeaponArcStrategy extends ShipSystemStrategy {
    private arcs;
    constructor(arcs?: WeaponArcs);
    hasArcs(): boolean;
    isPositionOnArc({ targetPosition }: {
        targetPosition: IVector;
    }): boolean;
    isOnArc({ target }: {
        target: Ship;
    }): boolean;
    getArcs({ facing }: {
        facing?: number | undefined;
    }): {
        start: number;
        end: number;
    }[];
}
export default WeaponArcStrategy;
