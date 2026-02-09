import Ship, { SerializedShip } from "./Ship";
export declare const createShipInstance: (className: string) => Ship;
export declare const createShipObject: (data: SerializedShip) => Ship;
export declare const createBareShipObject: (data: SerializedShip) => Ship;
