import CombatLogTorpedoIntercept from "../combatLog/CombatLogTorpedoIntercept";
import { Offset } from "../hexagon";
import { InterceptionEntry } from "./InterceptorCandidate";
import Ship from "./Ship";
import TorpedoFlight, { InterceptionPriority } from "./TorpedoFlight";
export declare class TorpedoFlightForIntercept extends TorpedoFlight {
    private path;
    private pathIndex;
    private interceptors;
    private hasNoInterceptionCandidates;
    private interceptionLogEntry;
    constructor(flight: TorpedoFlight, target: Ship);
    getLogEntry(): CombatLogTorpedoIntercept;
    setNoInterceptionCandidates(): void;
    getHasNoInterceptionCandidates(): boolean;
    isFullyIntercepted(): boolean;
    resetInterceptors(): void;
    addInterceptor(interceptor: InterceptionEntry): void;
    getInterceptors(): InterceptionEntry[];
    getInterceptionPriority(): InterceptionPriority;
    getCurrentDistanceToTarget(): number;
    getCurrentHexPosition(): Offset;
    getCurrentPosition(): import("../utils/Vector").default;
    getClosestDistanceTo(ship: Ship): number;
    advance(): void;
    getMaxIntercepts(): 1 | 3 | 6;
    isStricking(target: Ship): boolean;
}
