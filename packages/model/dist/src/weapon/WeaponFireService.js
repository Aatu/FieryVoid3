import { SYSTEM_HANDLERS } from "../unit/system/strategy/types/SystemHandlersTypes";
class WeaponFireService {
    gamedata = null;
    getGameData() {
        if (!this.gamedata) {
            throw new Error("No game data set");
        }
        return this.gamedata;
    }
    update(gamedata) {
        this.gamedata = gamedata;
        return this;
    }
    getAllFireOrders() {
        return this.getGameData()
            .ships.getShips()
            .reduce((all, ship) => [...all, ...this.getAllFireOrdersForShip(ship)], []);
    }
    getFireOrderById(id) {
        const fo = this.getAllFireOrders().find((order) => order.id === id);
        if (!fo) {
            throw new Error(`No fire order with id ${id}`);
        }
        return fo;
    }
    getAllFireOrdersForShip(shooter) {
        return shooter.systems
            .getSystems()
            .reduce((all, system) => [
            ...all,
            ...system.callHandler(SYSTEM_HANDLERS.getFireOrders, {}, []),
        ], []);
    }
    systemHasFireOrder(system) {
        const fireOrders = system.callHandler(SYSTEM_HANDLERS.getFireOrders, undefined, []);
        return fireOrders && fireOrders.length > 0;
    }
    getSystemFireOrderTargetId(system) {
        const fireOrders = system.callHandler(SYSTEM_HANDLERS.getFireOrders, undefined, []);
        return fireOrders && fireOrders.length > 0 ? fireOrders[0].targetId : null;
    }
    systemHasFireOrderAgainstShip(system, target) {
        const fireOrders = system.callHandler(SYSTEM_HANDLERS.getFireOrders, null, []);
        return fireOrders.some((order) => order.targetId === target.id);
    }
    addFireOrder(shooter, target, weapon) {
        if (!this.canFire(shooter, target, weapon)) {
            throw new Error("Check validity first");
        }
        return weapon.callHandler(SYSTEM_HANDLERS.addFireOrder, {
            shooter,
            target,
        }, []);
    }
    removeFireOrders(shooter, weapon) {
        weapon.callHandler(SYSTEM_HANDLERS.removeFireOrders, undefined, undefined);
    }
    canFire(shooter, target, weapon) {
        if (shooter.isDestroyed() ||
            target.isDestroyed() ||
            weapon.isDisabled() ||
            !weapon.callHandler(SYSTEM_HANDLERS.usesFireOrders, null, false)) {
            return false;
        }
        if (!weapon.callHandler(SYSTEM_HANDLERS.isOnArc, { target }, true)) {
            return false;
        }
        if (!weapon.callHandler(SYSTEM_HANDLERS.canFire, null, true)) {
            return false;
        }
        return true;
    }
}
export default WeaponFireService;
