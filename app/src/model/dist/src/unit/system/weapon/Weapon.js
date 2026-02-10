import ShipSystem, { ShipSystemType } from "../ShipSystem";
import AlwaysTargetableSystemStrategy from "../strategy/AlwaysTargetableSystemStrategy";
class Weapon extends ShipSystem {
    constructor(args, strategies) {
        super(args, strategies);
        if (args.alwaysTargetable) {
            this.addStrategy(new AlwaysTargetableSystemStrategy());
        }
    }
    getSystemType() {
        const value = ShipSystemType.EXTERNAL;
        return this.handlers.getShipSystemType(value);
    }
    isWeapon() {
        return true;
    }
    showOnSystemList() {
        return true;
    }
}
export default Weapon;
