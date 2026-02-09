import ShipSystemStrategy from "../ShipSystemStrategy";
import WeaponHitChance from "../../../../weapon/WeaponHitChance";
import CombatLogWeaponFireHitResult from "../../../../combatLog/CombatLogWeaponFireHitResult";
import { SYSTEM_HANDLERS } from "../types/SystemHandlersTypes";
class StandardHitStrategy extends ShipSystemStrategy {
    fireControl;
    numberOfShots;
    burstSize;
    burstGrouping;
    constructor(fireControl = 0, numberOfShots = 1, burstSize = 1, burstGrouping = 0) {
        super();
        this.fireControl = fireControl;
        this.numberOfShots = numberOfShots;
        this.burstSize = burstSize;
        this.burstGrouping = burstGrouping;
    }
    getMessages(payload, previousResponse = []) {
        previousResponse.push({
            header: "Fire control",
            value: this.fireControl,
        });
        return previousResponse;
    }
    getBaseHitChance({ shooter, target }) {
        return target.getHitProfile(shooter.getPosition());
    }
    checkFireOrderHits({ shooter, target, weaponSettings, combatLogEntry, }) {
        const toHit = this.getHitChance({ shooter, target, weaponSettings });
        const roll = Math.ceil(Math.random() * 100);
        const hit = roll <= toHit.result;
        const result = new CombatLogWeaponFireHitResult(hit, toHit, roll);
        combatLogEntry.addHitResult(result);
        if (hit) {
            const burstShots = this.getNumberOfBurstShotsHit({
                hitResolution: result,
            });
            result.shotsHit = burstShots;
            result.shotsMissed = this.burstSize - burstShots;
        }
        else {
            result.shotsHit = 0;
            result.shotsMissed = this.burstSize;
        }
        return result;
    }
    getNumberOfShots(payload, previousResponse = 1) {
        return this.numberOfShots;
    }
    getBurstSize(payload, previousResponse = 1) {
        return this.burstSize;
    }
    getBurstGrouping(payload, previousResponse = 0) {
        return this.burstGrouping;
    }
    getFireControl() {
        return this.fireControl;
    }
    getHitChance({ shooter, target, weaponSettings = {}, }) {
        const baseToHit = this.getSystem().callHandler(SYSTEM_HANDLERS.getBaseHitChance, {
            shooter,
            target,
            weaponSettings,
        }, 0);
        const dew = target.electronicWarfare.inEffect.getDefensiveEw();
        const oew = shooter.electronicWarfare.inEffect.getOffensiveEw(target);
        let distance = shooter.hexDistanceTo(target);
        const initialRangeModifier = this.getSystem().callHandler(SYSTEM_HANDLERS.getRangeModifier, {
            distance: distance,
            weaponSettings,
        }, 0);
        const rangeModifier = initialRangeModifier * (1 + target.movement.getActiveEvasion() / 10);
        const evasionPenalty = rangeModifier - initialRangeModifier;
        const rollingPenalty = shooter.movement.isRolling() ? -20 : 0;
        const noLockPenalty = oew >= 1 ? 0 : -this.getFireControl();
        const ownEvasionPenalty = -shooter.movement.getActiveEvasion() * 5;
        let result = baseToHit +
            rollingPenalty +
            this.getFireControl() +
            oew * 5 +
            dew * 5 +
            rangeModifier +
            noLockPenalty +
            ownEvasionPenalty;
        const onRange = this.getSystem().callHandler(SYSTEM_HANDLERS.isOnRange, {
            distance,
        }, false);
        const absoluteResult = result;
        result = Math.floor(result);
        if (result < 0) {
            result = 0;
        }
        return new WeaponHitChance({
            baseToHit,
            fireControl: this.fireControl,
            dew: dew,
            oew: oew,
            distance,
            rangeModifier,
            evasion: target.movement.getActiveEvasion(),
            evasionPenalty: evasionPenalty,
            result: onRange ? result : 0,
            absoluteResult,
            outOfRange: !onRange,
            rollingPenalty,
            noLockPenalty,
            ownEvasionPenalty,
        });
    }
    getNumberOfBurstShotsHit({ hitResolution, }) {
        const requiredToHit = hitResolution.hitChance.result;
        const rolledToHit = hitResolution.hitRoll;
        if (rolledToHit > requiredToHit) {
            return 0;
        }
        if (rolledToHit <= requiredToHit - this.burstSize * this.burstGrouping) {
            return this.burstSize;
        }
        let shots = Math.floor((requiredToHit - rolledToHit) / this.burstGrouping);
        if (shots > this.burstSize) {
            shots = this.burstSize;
        }
        if (shots <= 0) {
            shots = 1;
        }
        return shots;
    }
}
export default StandardHitStrategy;
