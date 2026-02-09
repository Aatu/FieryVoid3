import { IHexPosition } from "../hexagon";
import { IVector } from "./Vector";
declare const distance: (a: {
    x: number;
    y: number;
}, b: {
    x: number;
    y: number;
}) => number;
declare const distance3d: (pointA: IVector, pointB: IVector) => number;
declare const getSeededRandomGenerator: (seed: string) => () => number;
declare const addToDirection: (current: number, add: number) => number;
declare const getDistanceBetweenDirections: (start: number, end: number, direction?: number) => number;
declare const getPointBetween: (start: IVector, end: IVector, percentage: number, noRound?: boolean) => IVector;
declare const getPointBetween3d: (start: IVector, end: IVector, percentage: number, noRound?: boolean) => {
    x: number;
    y: number;
    z: number;
};
declare const getPointBetweenInDistance: (start: IVector, end: IVector, distance: number, noRound?: boolean) => {
    x: number;
    y: number;
    z: number;
};
declare const getDistanceBetweenShipsInHex: (s1: IHexPosition, s2: IHexPosition) => number;
declare const getAngleBetween: (angle1: number, angle2: number, right?: boolean) => number;
declare const addToHexFacing: (facing: number, add: number) => number;
declare const getPointInDirection: (r: number, a: number, cx: number, cy: number, noRound?: boolean) => {
    x: number;
    y: number;
};
declare const getArcLength: (start: number, end: number) => number;
declare const isInArc: (direction: number, start: number, end: number) => boolean;
declare const radianToDegree: (angle: number) => number;
declare const degreeToRadian: (angle: number) => number;
declare const getCompassHeadingOfPoint: (observer: IVector, target: IVector) => number;
declare const hexFacingToAngle: (d: number) => 0 | 180 | 60 | 120 | 240 | 300;
declare const angleToHexFacing: (d: number) => 0 | 1 | 2 | 4 | 3 | 5;
declare const shuffleArray: <T extends unknown[]>(a: T) => T;
export { distance, distance3d, getSeededRandomGenerator, addToDirection, getDistanceBetweenDirections, getPointBetween, getPointBetween3d, getPointBetweenInDistance, getDistanceBetweenShipsInHex, getAngleBetween, addToHexFacing, getPointInDirection, getArcLength, isInArc, radianToDegree, degreeToRadian, getCompassHeadingOfPoint, hexFacingToAngle, angleToHexFacing, shuffleArray, };
