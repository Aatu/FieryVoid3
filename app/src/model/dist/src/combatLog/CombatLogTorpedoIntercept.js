import WeaponHitChance from "../weapon/WeaponHitChance";
class CombatLogTorpedoIntercept {
    torpedoFlightId;
    replayOrder = 0;
    intercepts = [];
    constructor(torpedoFlightId) {
        this.torpedoFlightId = torpedoFlightId;
    }
    addIntercept(intercept) {
        this.intercepts.push(intercept);
    }
    isSucessfull() {
        return this.intercepts.some((i) => i.success);
    }
    serialize() {
        return {
            logEntryClass: this.constructor.name,
            torpedoFlightId: this.torpedoFlightId,
            intercepts: this.intercepts.map((i) => ({
                shipId: i.shipId,
                interceptorId: i.interceptorId,
                hitChance: i.hitChance.serialize(),
                roll: i.roll,
                success: i.success,
            })),
        };
    }
    deserialize(unknownData) {
        const data = unknownData;
        this.torpedoFlightId = data.torpedoFlightId;
        this.intercepts = data.intercepts.map((i) => ({
            shipId: i.shipId,
            interceptorId: i.interceptorId,
            hitChance: new WeaponHitChance().deserialize(i.hitChance),
            roll: i.roll,
            success: i.success,
        }));
        return this;
    }
}
export default CombatLogTorpedoIntercept;
