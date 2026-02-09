import WeaponHitChance from "../weapon/WeaponHitChance";
class CombatLogWeaponFireHitResult {
    result;
    hitChance;
    hitRoll;
    shotsHit;
    shotsMissed;
    static fromData(data = {}) {
        return new CombatLogWeaponFireHitResult(data.result || false, new WeaponHitChance().deserialize(data.hitChance), data.hitRoll || 1);
    }
    constructor(result, hitChance, hitRoll, shotsHit = result ? 1 : 0, shotsMissed = result ? 0 : 1) {
        this.result = result;
        this.hitChance = hitChance;
        this.hitRoll = hitRoll;
        this.shotsHit = shotsHit;
        this.shotsMissed = shotsMissed;
    }
    serialize() {
        return {
            result: this.result,
            hitChance: this.hitChance.serialize(),
            hitRoll: this.hitRoll,
            shotsHit: this.shotsHit,
            shotsMissed: this.shotsMissed,
        };
    }
    deserialize(data = {}) {
        this.result = data.result || false;
        this.hitChance = new WeaponHitChance().deserialize(data.hitChance);
        this.hitRoll = data.hitRoll || 1;
        return this;
    }
}
export default CombatLogWeaponFireHitResult;
