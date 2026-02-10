export class SystemHandlers {
    system;
    constructor(system) {
        this.system = system;
    }
    getTorpedoLaunchOptions(target) {
        return this.callHandler("getTorpedoLaunchOptions", null, { target });
    }
    isThrustDirection(direction) {
        return this.callHandler("isThrustDirection", false, direction);
    }
    setLaunchTarget(payload) {
        this.callHandler("setLaunchTarget", undefined, payload);
    }
    deserialize(data) {
        this.callHandler("deserialize", undefined, data);
    }
    serialize() {
        return this.callHandler("serialize", {});
    }
    launchTorpedos() {
        return this.callHandler("launchTorpedos") || [];
    }
    addCargo(cargo) {
        this.callHandler("addCargo", undefined, cargo);
    }
    removeAllCargo() {
        this.callHandler("removeAllCargo");
    }
    removeCargo(cargo) {
        return this.callHandler("removeCargo", undefined, cargo);
    }
    getCargoEntry(cargo) {
        return this.callHandler("getCargoEntry", undefined, cargo) || null;
    }
    getAllCargo() {
        return this.callHandler("getAllCargo") || [];
    }
    canAcceptCargo(cargo) {
        return Boolean(this.callHandler("canAcceptCargo", undefined, cargo));
    }
    isAllowedCargo(cargo) {
        return Boolean(this.callHandler("isAllowedCargo", undefined, cargo));
    }
    getAvailableCargoSpace() {
        return this.callHandler("getAvailableCargoSpace") || 0;
    }
    hasCargo(payload) {
        return Boolean(this.callHandler("hasCargo", undefined, payload));
    }
    hasCargoSpaceFor(entry) {
        return Boolean(this.callHandler("hasCargoSpaceFor", undefined, entry));
    }
    isCargoBay() {
        return Boolean(this.callHandler("isCargoBay"));
    }
    applyDamageFromWeaponFire(payload) {
        this.callHandler("applyDamageFromWeaponFire", undefined, payload);
    }
    toggleSelectedAmmo() {
        return this.callHandler("toggleSelectedAmmo");
    }
    getSelectedAmmo() {
        return this.callHandler("getSelectedAmmo") || null;
    }
    isAlwaysTargetable() {
        return Boolean(this.callHandler("isAlwaysTargetable"));
    }
    getShipSystemType(previousResponse) {
        return this.callHandler("getShipSystemType", previousResponse);
    }
    checkFireOrderHits(payload) {
        return this.callHandler("checkFireOrderHits", undefined, payload);
    }
    onWeaponFired() {
        this.callHandler("onWeaponFired");
    }
    canFire() {
        return Boolean(this.callHandler("canFire", true));
    }
    hasFireOrder() {
        return Boolean(this.callHandler("hasFireOrder"));
    }
    isPositionOnArc(targetPosition) {
        return Boolean(this.callHandler("isPositionOnArc", undefined, {
            targetPosition,
        }));
    }
    getTooltipMenuButton(payload) {
        return this.callHandler("getTooltipMenuButton", [], payload);
    }
    getInterceptChance(target, torpedoFlight) {
        if (!this.canIntercept()) {
            throw new Error("Cannot intercept");
        }
        return this.callHandler("getInterceptChance", undefined, {
            target,
            torpedoFlight,
        });
    }
    canIntercept() {
        return Boolean(this.callHandler("canIntercept"));
    }
    getUsedIntercepts() {
        return this.callHandler("getUsedIntercepts", 0);
    }
    addUsedIntercept(amount = 1) {
        this.callHandler("addUsedIntercept", undefined, amount);
    }
    getNumberOfShots() {
        return this.callHandler("getNumberOfShots", 1);
    }
    getBurstSize() {
        return this.callHandler("getBurstSize", 1);
    }
    getBurstGrouping() {
        return this.callHandler("getBurstGrouping", 0);
    }
    resetBoost() {
        this.callHandler("resetBoost");
    }
    isBoostable() {
        return Boolean(this.callHandler("isBoostable"));
    }
    canBoost() {
        return Boolean(this.callHandler("canBoost"));
    }
    canDeBoost() {
        return Boolean(this.callHandler("canDeBoost"));
    }
    getBoost() {
        return this.callHandler("getBoost") || 0;
    }
    boost() {
        this.callHandler("boost");
    }
    deBoost() {
        this.callHandler("deBoost");
    }
    callHandler(functionName, response, payload) {
        this.system.strategies.forEach((strategy) => {
            if (
            // @ts-expect-error I dont know how to type this
            typeof strategy[functionName] === "function") {
                // @ts-expect-error I dont know how to type this
                response = strategy[functionName](payload, response);
            }
        });
        return response;
    }
}
