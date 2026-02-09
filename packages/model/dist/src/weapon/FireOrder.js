import Ship from "../unit/Ship";
import ShipSystem from "../unit/system/ShipSystem";
class FireOrder {
    id;
    shooterId;
    targetId;
    weaponId;
    weaponSettings;
    resolved;
    static fromData(data) {
        return new FireOrder(data.id || null, data.shooterId, data.targetId, data.weaponId, data.weaponSettings || {}, data.resolved);
    }
    constructor(id, shooter, target, weapon, weaponSettigs = {}, resolved = false) {
        this.id = id;
        this.shooterId = shooter instanceof Ship ? shooter.getId() : shooter;
        this.targetId = target instanceof Ship ? target.getId() : target;
        this.weaponId = weapon instanceof ShipSystem ? weapon.id : weapon;
        this.weaponSettings = weaponSettigs;
        this.resolved = resolved;
    }
    setId(id) {
        this.id = id;
        return this;
    }
    getId() {
        if (!this.id) {
            throw new Error("FireOrder has no id");
        }
        return this.id;
    }
    setResolved() {
        this.resolved = true;
        return this;
    }
    serialize() {
        return {
            id: this.id,
            shooterId: this.shooterId,
            targetId: this.targetId,
            weaponId: this.weaponId,
            weaponSettings: this.weaponSettings,
            resolved: this.resolved,
        };
    }
    deserialize(data) {
        return FireOrder.fromData(data);
    }
}
export default FireOrder;
