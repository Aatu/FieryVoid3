import ShipSystemStrategy from "./ShipSystemStrategy";
class AllowsEvasionSystemStrategy extends ShipSystemStrategy {
    evasion;
    constructor(evasion) {
        super();
        this.evasion = evasion || 0;
    }
    getMaxEvasion = (payload, previousResponse = 0) => {
        if (this.getSystem().isDisabled()) {
            return previousResponse;
        }
        return previousResponse + this.evasion;
    };
}
export default AllowsEvasionSystemStrategy;
