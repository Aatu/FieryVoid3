import GameData from "../game/GameData";
import WeaponHitChance from "../weapon/WeaponHitChance";
import Ship from "./Ship";
import Weapon from "./system/weapon/Weapon";
import { TorpedoFlightForIntercept } from "./TorpedoFlightForIntercept";
export declare class InterceptorCandidate {
    private interceptor;
    entries: InterceptionEntry[];
    constructor(interceptor: Weapon);
    addEntry(target: Ship, flight: TorpedoFlightForIntercept, gameData: GameData): void;
    wantToIntercept(flight: TorpedoFlightForIntercept): boolean;
    getEntry(flight: TorpedoFlightForIntercept): InterceptionEntry;
    hasTargets(): boolean;
    getInterceptor(): Weapon;
    canIntercept(): boolean;
    getUsedIntercepts(): number;
    getNumberOfShots(): number;
}
export type InterceptionEntry = {
    target: Ship;
    torpedoFlight: TorpedoFlightForIntercept;
    hitChance: WeaponHitChance;
    candidate: InterceptorCandidate;
};
