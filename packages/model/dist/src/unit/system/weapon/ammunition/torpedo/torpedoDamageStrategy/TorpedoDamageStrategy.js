import { UnifiedDamageStrategy, } from "../../../../strategy/weapon/UnifiedDamageStrategy";
import { DiceRoller, } from "../../../../../../utils/DiceRoller";
import CombatLogDamageEntry from "../../../../../../combatLog/CombatLogDamageEntry";
class TorpedoDamageStrategy {
    damageStrategy;
    msvAmount = 0;
    msvRangePenalty = 0;
    msvStrikeHitChanceTarget = 20;
    msvMinStrikeDistance = 0;
    hitBonus = 0;
    evasionModifier = 0;
    constructor(args, msvArgs) {
        this.damageStrategy = new UnifiedDamageStrategy(args);
        this.msvAmount = msvArgs?.msvAmount || 0;
        this.msvRangePenalty = msvArgs?.msvRangePenalty || 0;
        this.msvStrikeHitChanceTarget = msvArgs?.msvStrikeHitChanceTarget || 0;
        this.msvMinStrikeDistance = msvArgs?.msvMinStrikeDistance || 0;
        this.hitBonus = msvArgs?.msvHitBonus || 0;
        this.evasionModifier = msvArgs?.msvEvasionModifier || 0;
    }
    isMsv() {
        return Boolean(this.msvAmount);
    }
    getMsvAmount() {
        return this.msvAmount;
    }
    getAttackRunMessages(payload, previousResponse = []) {
        return [
            ...previousResponse,
            {
                header: "Strike distance",
                value: this.getStrikeDistance(payload),
            },
        ];
    }
    getMessages(payload, previousResponse = []) {
        if (this.msvAmount) {
            previousResponse.push({
                header: "Number of SVs",
                value: this.msvAmount.toString(),
            });
            /*
            previousResponse.push({
              header: "Damage per SV",
              value: this.damageFormula || "None",
            });
      
            previousResponse.push({
              header: "Armor piercing per SV",
              value: this.armorPiercingFormula || "None",
            });
            */
            previousResponse.push({
                header: "SV range penalty",
                value: this.msvRangePenalty,
            });
            previousResponse.push({
                header: "Target hit chance",
                value: `${this.msvStrikeHitChanceTarget}%`,
            });
        }
        return previousResponse;
    }
    getStrikeDistance(payload) {
        if (this.msvAmount === 0) {
            return 0;
        }
        let distance = 11;
        while (distance--) {
            if (distance === this.msvMinStrikeDistance) {
                return distance;
            }
            if (this.getHitChance({ ...payload, distance }) >=
                this.msvStrikeHitChanceTarget) {
                return distance;
            }
        }
        return 1;
    }
    getHitChance({ target, torpedoFlight, distance, }) {
        const hitProfile = target.getHitProfile(torpedoFlight.strikePosition) + this.hitBonus;
        const rangeModifier = this.msvRangePenalty *
            (1 + (target.movement.getEvasion() * this.evasionModifier) / 10) *
            distance;
        return hitProfile - rangeModifier;
    }
    applyDamageFromWeaponFire(payload) {
        const attackPosition = payload.torpedoFlight.launchPosition;
        const damagePayload = {
            ...payload,
            attackPosition,
        };
        if (this.msvAmount) {
            this.applyDamageFromMSVTorpedo(damagePayload);
        }
        else {
            this.applyDamageFromNormalTorpedo(damagePayload);
        }
    }
    applyDamageFromMSVTorpedo(payload) {
        const { combatLogEntry } = payload;
        const diceRoller = payload.diceRoller || new DiceRoller();
        const distance = this.getStrikeDistance(payload);
        const hitChance = this.getHitChance({ ...payload, distance });
        let shots = diceRoller.roll(this.msvAmount);
        combatLogEntry.addNote(`MSV with ${shots} projectiles at distance ${distance} with hit chance of ${hitChance}% each.`);
        let hits = 0;
        while (shots--) {
            const roll = Math.ceil(Math.random() * 100);
            const hit = roll <= hitChance;
            if (hit) {
                hits++;
                const combatLogDamageEntry = new CombatLogDamageEntry();
                this.damageStrategy.applyDamageFromWeaponFire({
                    ...payload,
                    combatLogDamageEntry,
                });
            }
        }
        combatLogEntry.addNote(`${hits} MSVs hit target.`);
    }
    applyDamageFromNormalTorpedo(payload) {
        this.damageStrategy.applyDamageFromWeaponFire(payload);
    }
}
export default TorpedoDamageStrategy;
