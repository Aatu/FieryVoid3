import ShipSystemStrategy from "./ShipSystemStrategy";
import { ForcedOffline } from "../criticals/index";
import { SYSTEM_HANDLERS } from "./types/SystemHandlersTypes";
class RequiresPowerSystemStrategy extends ShipSystemStrategy {
    power;
    getsCriticals;
    constructor(power, getsCriticals = true) {
        super();
        this.power = power || 0;
        if (this.power <= 0) {
            throw new Error("Power must be more than zero");
        }
        this.getsCriticals = getsCriticals;
    }
    getMessages(payload, previousResponse = []) {
        previousResponse.push({
            sort: "AAAA",
            header: "Power requirement",
            value: this.getSystem().callHandler(SYSTEM_HANDLERS.getPowerRequirement, null, 0),
        });
        return previousResponse;
    }
    getPowerRequirement(payload, previousResponse = 0) {
        return this.power + previousResponse;
    }
    canSetOffline(payload, previousResponse = false) {
        return true;
    }
    canSetOnline() {
        return true;
    }
    shouldBeOffline(payload, previousResponse = false) {
        if (previousResponse === true) {
            return true;
        }
        return this.getSystem().hasCritical(ForcedOffline);
    }
    getTooltipMenuButton(payload, previousResponse = []) {
        if (!payload?.myShip) {
            return previousResponse;
        }
        const system = this.getSystem();
        if (system.getShipSystems().power.canSetOnline(system)) {
            return [
                ...previousResponse,
                {
                    sort: 0,
                    img: "/img/goOnline.png",
                    clickHandler: () => system.power.setOnline(),
                },
            ];
        }
        else if (system.getShipSystems().power.canSetOffline(system)) {
            return [
                ...previousResponse,
                {
                    sort: 0,
                    img: "/img/goOffline.png",
                    clickHandler: () => system.power.setOffline(),
                },
            ];
        }
        return previousResponse;
    }
    getPossibleCriticals(payload, previousResponse = []) {
        if (!this.getsCriticals) {
            return previousResponse;
        }
        return [
            ...previousResponse,
            {
                severity: 20,
                critical: new ForcedOffline(1),
            },
            {
                severity: 40,
                critical: new ForcedOffline(2),
            },
            {
                severity: 60,
                critical: new ForcedOffline(3),
            },
            {
                severity: 80,
                critical: new ForcedOffline(4),
            },
        ];
    }
}
export default RequiresPowerSystemStrategy;
