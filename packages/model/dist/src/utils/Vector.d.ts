import * as THREE from "three";
export interface IVector {
    x: number;
    y: number;
    z: number;
}
export declare const isIVector: (v: any) => v is IVector;
declare class Vector implements IVector {
    x: number;
    y: number;
    z: number;
    constructor(x?: number | THREE.Vector3 | THREE.Vector2 | Vector | IVector, y?: number, z?: number);
    set(x?: number | THREE.Vector3 | THREE.Vector2 | Vector | IVector, y?: number, z?: number): this;
    static toVector(vector: THREE.Vector3 | THREE.Vector2 | Vector | IVector): Vector;
    clone(): Vector;
    serialize(): {
        x: number;
        y: number;
        z: number;
    };
    setX(x: number): Vector;
    setY(y: number): Vector;
    setZ(z: number): Vector;
    setFromAngle(a: number): Vector;
    distanceTo(vector: IVector): number;
    add(vector: IVector): Vector;
    dot(vector: IVector): number;
    subtract(vector: IVector): Vector;
    sub(vector: IVector): Vector;
    normalize(): Vector;
    multiplyScalar(scalar: number): Vector;
    length(): number;
    applyMatrix4(matrix: THREE.Matrix4): Vector;
    equals(vector: IVector): boolean;
    round(): Vector;
    roundToHexCenter(): Vector;
    toOffset(): import("../hexagon").Offset;
    toString(): string;
    toThree(): THREE.Vector3;
    toObject(): {
        x: number;
        y: number;
        z: number;
    };
}
export default Vector;
