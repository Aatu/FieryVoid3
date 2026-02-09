import StandardDamageStrategy from "./StandardDamageStrategy";
class ExplosiveDamageStrategy extends StandardDamageStrategy {
    numberOfDamagesFormula;
    constructor(damageFormula, armorPiercingFormula, numberOfDamagesFormula = 1) {
        super(damageFormula, armorPiercingFormula);
        this.numberOfDamagesFormula = numberOfDamagesFormula;
    }
    getDamageTypeMessage() {
        return "Explosive";
    }
    getMessages(payload, previousResponse = []) {
        previousResponse.push({
            header: "Damage type",
            value: this.getDamageTypeMessage(),
        });
        previousResponse.push({
            header: "Number of hits",
            value: this.numberOfDamagesFormula,
        });
        previousResponse.push({
            header: "Damage per hit",
            value: this.getDamageMessage(),
        });
        previousResponse.push({
            header: "Armor piercing per hit",
            value: this.getArmorPiercingMessage(),
        });
        return previousResponse;
    }
    getNumberOfDamagesForWeaponHit() {
        if (Number.isInteger(this.numberOfDamagesFormula)) {
            return this.numberOfDamagesFormula;
        }
        return this.diceRoller.roll(this.numberOfDamagesFormula);
    }
    doDamage(payload, damageResult) {
        const { target, shooterPosition } = payload;
        let numberOfDamages = this.getNumberOfDamagesForWeaponHit();
        while (numberOfDamages--) {
            const hitSystem = this.chooseHitSystem({
                target,
                shooterPosition,
            });
            if (!hitSystem) {
                return;
            }
            this.doDamageToSystem(payload, damageResult, hitSystem, this.getArmorPiercing(payload), this.getDamageForWeaponHit(payload));
        }
    }
}
export default ExplosiveDamageStrategy;
