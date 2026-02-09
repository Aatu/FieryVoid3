export class InterceptorCandidate {
    interceptor;
    entries = [];
    constructor(interceptor) {
        this.interceptor = interceptor;
    }
    addEntry(target, flight, gameData) {
        if (!this.canIntercept()) {
            return;
        }
        if (gameData.slots.getTeamForShip(this.interceptor.getShip()) !==
            gameData.slots.getTeamForShip(target)) {
            return;
        }
        if (flight
            .getCurrentHexPosition()
            .distanceTo(this.interceptor.getShip().getHexPosition()) > 10) {
            return;
        }
        if (!this.interceptor.handlers.isPositionOnArc(flight.getCurrentPosition())) {
            return;
        }
        const hitChance = this.interceptor.handlers.getInterceptChance(target, flight);
        if (hitChance.result > 0) {
            this.entries.push({
                target,
                torpedoFlight: flight,
                hitChance: hitChance,
                candidate: this,
            });
        }
    }
    wantToIntercept(flight) {
        const entry = this.entries.find((entry) => entry.torpedoFlight === flight);
        if (!entry) {
            return false;
        }
        const targetsThisShip = flight.targetId === this.interceptor.getShip().id;
        const torpedoDefenseOpinion = this.interceptor
            .getShip()
            .torpedoDefense.canIntercept(flight.interceptionPriority, targetsThisShip, entry.hitChance.result);
        return torpedoDefenseOpinion;
    }
    getEntry(flight) {
        const entry = this.entries.find((entry) => entry.torpedoFlight === flight);
        if (!entry) {
            throw new Error("No entry found for flight");
        }
        return entry;
    }
    hasTargets() {
        return this.entries.length > 0 && this.canIntercept();
    }
    getInterceptor() {
        return this.interceptor;
    }
    canIntercept() {
        return (this.getNumberOfShots() > this.getUsedIntercepts() &&
            this.interceptor.heat.getOverheatPercentage() < 1 &&
            this.interceptor.handlers.canFire());
    }
    getUsedIntercepts() {
        return this.interceptor.handlers.getUsedIntercepts();
    }
    getNumberOfShots() {
        return this.interceptor.handlers.getNumberOfShots();
    }
}
