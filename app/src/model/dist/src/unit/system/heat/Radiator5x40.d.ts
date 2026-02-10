import Radiator from "./Radiator";
declare class Radiator5x40 extends Radiator {
    constructor({ id }: {
        id: number;
    });
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default Radiator5x40;
