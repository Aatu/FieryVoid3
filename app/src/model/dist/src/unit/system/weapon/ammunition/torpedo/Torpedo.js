import CargoEntity from "../../../../../cargo/CargoEntity";
class Torpedo extends CargoEntity {
    minRange;
    maxRange;
    hitSize;
    evasion;
    damageStrategy = null;
    visuals;
    constructor({ minRange = 100, maxRange = 300, hitSize = 0, evasion = 30 }) {
        super();
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.hitSize = hitSize;
        this.evasion = evasion;
        this.visuals = {
            engineColor: [51 / 255, 163 / 255, 255 / 255],
            explosionType: "HE",
            explosionSize: 15,
        };
    }
    getDamageStrategy() {
        if (!this.damageStrategy) {
            throw new Error("No damage strategy set for torpedo");
        }
        return this.damageStrategy;
    }
    getStrikeDistance(flight, target) {
        return 1;
    }
    getHitSize() {
        return this.hitSize;
    }
    getEvasion() {
        return this.evasion;
    }
    getCargoInfo() {
        const previousResponse = super.getCargoInfo();
        return [
            ...previousResponse,
            { header: "Range", value: `${this.minRange} – ${this.maxRange} hexes` },
            { header: "Evasion", value: `+${this.evasion * 10}% range penalty` },
            ...(this.damageStrategy?.getMessages(undefined, []) || []),
        ];
    }
}
export default Torpedo;
