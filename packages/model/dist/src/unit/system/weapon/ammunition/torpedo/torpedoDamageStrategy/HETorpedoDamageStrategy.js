import CombatLogDamageEntry from "../../../../../../combatLog/CombatLogDamageEntry";
import ExplosiveDamageStrategy from "../../../../strategy/weapon/ExplosiveDamageStrategy";
import { isMSVTorpedoDamagePayload } from "./MSVTorpedoDamageStrategy";
class HETorpedoDamageStrategy extends ExplosiveDamageStrategy {
    constructor(damageFormula, armorPiercingFormula, numberOfHitsFormula) {
        super(damageFormula, armorPiercingFormula, numberOfHitsFormula);
    }
    getAttackRunMessages(payload, previousResponse = []) {
        return [
            {
                header: "Strike distance",
                value: this.getStrikeDistance(),
            },
        ];
    }
    getDamageMessage() {
        return this.damageFormula || "";
    }
    getArmorPiercingMessage() {
        return this.armorPiercingFormula || "";
    }
    getStrikeDistance() {
        return 1;
    }
    applyDamageFromWeaponFire(payload) {
        if (!isMSVTorpedoDamagePayload(payload)) {
            throw new Error("Invalid payload");
        }
        const { torpedoFlight, combatLogEntry } = payload;
        const attackPosition = torpedoFlight.launchPosition;
        const result = new CombatLogDamageEntry();
        combatLogEntry.addDamage(result);
        this.doDamage({ shooterPosition: attackPosition, ...payload }, result);
    }
}
export default HETorpedoDamageStrategy;
