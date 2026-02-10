import { IVector } from "../utils/Vector";
import Offset from "./Offset";
declare class Cube {
    x: number;
    y: number;
    z: number;
    constructor(x: Cube | IVector | number, y?: number, z?: number);
    round(): Cube;
    private validate;
    getNeighbours(): Cube[];
    moveToDirection(direction: number, steps?: number): Cube;
    add(cube: Cube): Cube;
    subtract(cube: Cube): Cube;
    scale(scale: number): Cube;
    distanceTo(cube: Cube): number;
    equals(cube: Cube | IVector): boolean;
    clone(): Cube;
    getFacing(neighbour: Cube): number;
    ring(radius: number): Cube[];
    spiral(radius: number): Cube[];
    toOffset(): Offset;
    toString(): string;
    private formatNumber;
    normalize(): Cube;
    drawLine(target: Cube, distance?: number | null): Cube[];
    rotate(facing: number): Cube;
}
export default Cube;
