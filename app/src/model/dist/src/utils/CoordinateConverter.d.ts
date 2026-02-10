import * as THREE from "three";
import Vector, { IVector } from "./Vector";
import { Cube, Offset } from "../hexagon/index";
import { IOffset } from "../hexagon/Offset";
type Camera = {
    getCamera: () => THREE.Camera;
};
type Scene = {
    children: THREE.Object3D[];
};
export declare class CoordinateConverter {
    private hexlenght;
    private width;
    private height;
    private zoom;
    private camera;
    private scene;
    private raycaster;
    constructor();
    init(camera: Camera, scene: Scene): void;
    getScene(): Scene;
    getCamera(): Camera;
    onResize({ width, height }: {
        width: number;
        height: number;
    }): void;
    onZoom(zoom: number): void;
    fromHexToViewport(hex: Cube | Offset | IOffset): {
        x: number;
        y: number;
    };
    getHexHeightViewport(): number;
    getHexDistance(): number;
    fromGameToHex(gameCoordinates: Vector | IVector): Offset;
    fromHexToGame(offsetHex: Cube | Offset | IOffset): Vector;
    fromViewPortToGame(pos: {
        x: number;
        y: number;
        xR: number;
        yR: number;
    }): {
        x: number;
        y: number;
        z: number;
    };
    getEntitiesIntersected(pos: {
        xR: number;
        yR: number;
    }): unknown[];
    fromGameToViewPort(pos: IVector): {
        x: number;
        y: number;
    };
}
declare const coordinateConverter: CoordinateConverter;
export default coordinateConverter;
