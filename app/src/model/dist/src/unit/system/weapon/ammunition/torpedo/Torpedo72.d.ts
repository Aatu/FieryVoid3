import Torpedo from "./Torpedo";
declare class Torpedo72 extends Torpedo {
    constructor({ minRange, maxRange, hitSize, evasion, }: {
        minRange?: number | undefined;
        maxRange?: number | undefined;
        hitSize?: number | undefined;
        evasion?: number | undefined;
    });
}
export default Torpedo72;
