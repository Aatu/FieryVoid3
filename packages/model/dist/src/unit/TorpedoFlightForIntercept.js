import CombatLogTorpedoIntercept from "../combatLog/CombatLogTorpedoIntercept";
import coordinateConverter from "../utils/CoordinateConverter";
import TorpedoFlight, { InterceptionPriority } from "./TorpedoFlight";
export class TorpedoFlightForIntercept extends TorpedoFlight {
    path;
    pathIndex = 0;
    interceptors = [];
    hasNoInterceptionCandidates = false;
    interceptionLogEntry = null;
    constructor(flight, target) {
        super(flight.torpedo, flight.targetId, flight.shooterId, flight.weaponId);
        this.id = flight.id;
        this.launchPosition = flight.launchPosition;
        this.strikePosition = flight.strikePosition;
        this.intercepted = flight.intercepted;
        this.done = flight.done;
        this.pathIndex = this.pathStartIndex;
        const targetPosition = target.movement
            .getLastEndMoveOrSurrogate()
            .getHexPosition();
        this.path = this.getStrikePositionHex().drawLine(targetPosition);
    }
    getLogEntry() {
        if (!this.interceptionLogEntry) {
            this.interceptionLogEntry = new CombatLogTorpedoIntercept(this.id);
        }
        return this.interceptionLogEntry;
    }
    setNoInterceptionCandidates() {
        this.hasNoInterceptionCandidates = true;
    }
    getHasNoInterceptionCandidates() {
        return this.hasNoInterceptionCandidates;
    }
    isFullyIntercepted() {
        return this.interceptors.length >= this.getMaxIntercepts();
    }
    resetInterceptors() {
        this.interceptors = [];
        this.hasNoInterceptionCandidates = false;
    }
    addInterceptor(interceptor) {
        this.interceptors.push(interceptor);
    }
    getInterceptors() {
        return this.interceptors;
    }
    getInterceptionPriority() {
        return this.interceptionPriority;
    }
    getCurrentDistanceToTarget() {
        return this.path.length - this.pathIndex;
    }
    getCurrentHexPosition() {
        return this.path[this.pathIndex];
    }
    getCurrentPosition() {
        return coordinateConverter.fromHexToGame(this.path[this.pathIndex]);
    }
    getClosestDistanceTo(ship) {
        //TODO: Torpedo might strike before reaching this distance
        return this.path.reduce((closest, hex) => {
            const distance = hex.distanceTo(ship.getHexPosition());
            return distance < closest ? distance : closest;
        }, Infinity);
    }
    advance() {
        this.pathIndex++;
        if (this.pathIndex >= this.path.length) {
            throw new Error("Torpedo flight has reached the end of its path");
        }
    }
    getMaxIntercepts() {
        switch (this.interceptionPriority) {
            case InterceptionPriority.HIGH:
                return 6;
            case InterceptionPriority.MEDIUM:
                return 3;
            case InterceptionPriority.LOW:
                return 1;
            default:
                return 1;
        }
    }
    isStricking(target) {
        if (this.pathIndex === this.path.length - 1) {
            return true;
        }
        const strikeDistance = this.torpedo
            .getDamageStrategy()
            .getStrikeDistance({ target, torpedoFlight: this });
        return this.getCurrentDistanceToTarget() <= strikeDistance;
    }
}
