import * as Yup from "yup";
import { InterceptionPriority } from "./TorpedoFlight";
export class ShipTorpedoDefense {
    minHitChangeLowPriority = 50;
    minHitChangeMediumPriority = 20;
    minHitChangeHighPriority = 10;
    otherShipInterceptionMod = 10;
    constructor(args = {}) {
        this.deserialize(args);
    }
    deserialize(args) {
        this.minHitChangeLowPriority =
            args?.minHitChangeLowPriority || this.minHitChangeLowPriority;
        this.minHitChangeMediumPriority =
            args?.minHitChangeMediumPriority || this.minHitChangeMediumPriority;
        this.minHitChangeHighPriority =
            args?.minHitChangeHighPriority || this.minHitChangeHighPriority;
        this.otherShipInterceptionMod =
            args?.otherShipInterceptionMod || this.otherShipInterceptionMod;
    }
    serialize() {
        return {
            minHitChangeLowPriority: this.minHitChangeLowPriority,
            minHitChangeMediumPriority: this.minHitChangeMediumPriority,
            minHitChangeHighPriority: this.minHitChangeHighPriority,
            otherShipInterceptionMod: this.otherShipInterceptionMod,
        };
    }
    receivePlayerData(clientShip) {
        const serialized = clientShip.torpedoDefense.serialize();
        const schema = Yup.object().shape({
            minHitChangeLowPriority: Yup.number().positive().integer().required(),
            minHitChangeMediumPriority: Yup.number().positive().integer().required(),
            minHitChangeHighPriority: Yup.number().positive().integer().required(),
            otherShipInterceptionMod: Yup.number().integer().required(),
        });
        if (!schema.isValidSync(serialized)) {
            throw new Error("Invalid ship torpedo defense");
        }
        this.deserialize(serialized);
    }
    canIntercept(interceptionPriority, targetsThisShip, hitChance) {
        let minHitChange = 0;
        switch (interceptionPriority) {
            case InterceptionPriority.LOW:
                minHitChange = this.minHitChangeLowPriority;
                break;
            case InterceptionPriority.MEDIUM:
                minHitChange = this.minHitChangeMediumPriority;
                break;
            case InterceptionPriority.HIGH:
                minHitChange = this.minHitChangeHighPriority;
                break;
        }
        if (!targetsThisShip) {
            minHitChange += this.otherShipInterceptionMod;
        }
        return hitChance >= minHitChange;
    }
}
