import ShipSystemStrategy from "../ShipSystemStrategy";
import FireOrder from "../../../../weapon/FireOrder";
import CombatLogWeaponFire from "../../../../combatLog/CombatLogWeaponFire";
import { SYSTEM_HANDLERS } from "../types/SystemHandlersTypes";
class FireOrderStrategy extends ShipSystemStrategy {
    resolutionPriority;
    fireOrders;
    constructor(resolutionPriority = 10) {
        super();
        this.resolutionPriority = resolutionPriority;
        this.fireOrders = [];
    }
    executeFireOrders({ gameData }) {
        this.fireOrders.forEach((fireOrder) => {
            const weapon = this.getSystem();
            const shooter = gameData.ships.getShipById(fireOrder.shooterId);
            const target = gameData.ships.getShipById(fireOrder.targetId);
            const weaponSettings = fireOrder.weaponSettings;
            /*
            if (!this.system.callHandler("isOnArc", { shooter, target })) {
              gameData.combatLog.addEntry(new CombatLogWeaponOutOfArc(fireOrder.id));
              return false;
            }
            */
            if (!this.getSystem().callHandler(SYSTEM_HANDLERS.canFire, { shooter, target }, true)) {
                return false;
            }
            let shots = this.getSystem().handlers.getNumberOfShots();
            while (shots--) {
                if (!weapon.handlers.canFire()) {
                    continue;
                }
                const combatLogEntry = new CombatLogWeaponFire(fireOrder.getId(), fireOrder.targetId, fireOrder.shooterId, weapon.handlers.getSelectedAmmo());
                const hitResolution = weapon.handlers.checkFireOrderHits({
                    shooter,
                    target,
                    weaponSettings,
                    combatLogEntry,
                });
                let shotsHit = hitResolution.shotsHit;
                while (shotsHit--) {
                    weapon.handlers.applyDamageFromWeaponFire({
                        target,
                        combatLogEntry,
                        attackPosition: shooter.getPosition(),
                        argsOverrider: weapon.handlers.getSelectedAmmo() || undefined,
                    });
                }
                weapon.callHandler(SYSTEM_HANDLERS.onWeaponFired, undefined, undefined);
                gameData.combatLog.addEntry(combatLogEntry);
            }
            fireOrder.setResolved();
        });
    }
    usesFireOrders() {
        return true;
    }
    getFireOrderResolutionPriority() {
        return this.resolutionPriority;
    }
    hasFireOrder() {
        return this.fireOrders.length > 0;
    }
    getFireOrders() {
        return this.fireOrders;
    }
    removeFireOrders() {
        this.fireOrders = [];
    }
    addFireOrder({ shooter, target, weaponSettings, }) {
        this.fireOrders = [];
        const order = new FireOrder(null, shooter, target, this.getSystem(), weaponSettings);
        this.fireOrders.push(order);
        return this.fireOrders;
    }
    serialize(payload, previousResponse = []) {
        return {
            ...previousResponse,
            fireOrderStrategy: this.fireOrders.map((fire) => fire.serialize()),
        };
    }
    deserialize(data = {}) {
        this.fireOrders = data.fireOrderStrategy
            ? data.fireOrderStrategy.map((entry) => FireOrder.fromData(entry))
            : [];
        return this;
    }
    advanceTurn(turn) {
        this.fireOrders = [];
    }
    censorForUser({ mine }) {
        if (!mine) {
            this.fireOrders = [];
        }
    }
    onSystemOffline() {
        this.removeFireOrders();
    }
}
export default FireOrderStrategy;
