import CargoEntity from "../../../../cargo/CargoEntity";
class Ammo extends CargoEntity {
    damageArgs;
    constructor(args) {
        super();
        this.damageArgs = args;
    }
    getDamageOverrider(args) {
        return this.damageArgs;
    }
    getCargoInfo() {
        const previousResponse = super.getCargoInfo();
        return [
            {
                header: "Damage",
                value: this.damageArgs.damageFormula.toString(),
            },
            {
                header: "Armor piercing",
                value: this.damageArgs.armorPiercingFormula.toString(),
            },
            ...previousResponse,
        ];
    }
    getIconText() {
        return "";
    }
    getConstructorName() {
        return this.constructor.name;
    }
}
export default Ammo;
