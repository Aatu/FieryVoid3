import Cube from "./Cube";
export interface IOffset {
    q: number;
    r: number;
}
export declare const isIOffset: (v: any) => v is IOffset;
declare class Offset {
    q: number;
    r: number;
    constructor(q: Offset | IOffset | number, r?: number);
    getNeighbours(): Offset[];
    getNeighbourAtHeading(heading: number): Offset;
    add(offset: Offset): Offset;
    subtract(offset: Offset): Offset;
    scale(scale: number): Offset;
    moveToDirection(direction: number, steps?: number): Offset;
    equals(offset: Offset | {
        q: number;
        r: number;
    }): boolean;
    getNeighbourAtDirection(direction: number): Offset | undefined;
    distanceTo(target: Offset): number;
    ring(radius: number): Offset[];
    spiral(radius: number): Offset[];
    clone(): Offset;
    toCube(): Cube;
    toVector(): import("../utils/Vector").default;
    drawLine(target: Offset, distance?: number): Offset[];
    toString(): string;
    rotate(facing: number): Offset;
    normalize(): Offset;
}
export default Offset;
