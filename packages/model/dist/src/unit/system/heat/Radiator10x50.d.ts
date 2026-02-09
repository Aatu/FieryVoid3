import Radiator from "./Radiator";
declare class Radiator10x50 extends Radiator {
    constructor({ id }: {
        id: number;
    });
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default Radiator10x50;
