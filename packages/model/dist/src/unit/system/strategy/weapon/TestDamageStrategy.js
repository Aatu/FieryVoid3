import { UnifiedDamageSystemStrategy } from "./UnifiedDamageStrategy";
class TestDamageStrategy extends UnifiedDamageSystemStrategy {
    constructor(damage) {
        super({ damageFormula: damage, armorPiercingFormula: 1000 });
    }
}
export default TestDamageStrategy;
