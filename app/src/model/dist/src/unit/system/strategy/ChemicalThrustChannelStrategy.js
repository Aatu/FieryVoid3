import { ThrustChannelHeatIncreased } from "../criticals";
import { THRUSTER_DIRECTION, } from "./ThrustChannelSystemStrategy";
export class ChemicalThrustChannelStrategy {
    thrusterArgs;
    constructor(args) {
        this.thrusterArgs = args;
    }
    isBoostable() {
        return false;
    }
    canBoost() {
        return false;
    }
    getMessages(system) {
        return [];
    }
    equals(other) {
        return this.getStrategyName() === other.getStrategyName();
    }
    getBackgroundImage(system) {
        if (system.handlers.isThrustDirection(THRUSTER_DIRECTION.AFT)) {
            return "/img/system/thrusterC2.png";
        }
        else if (system.handlers.isThrustDirection(THRUSTER_DIRECTION.STARBOARD_AFT)) {
            return "/img/system/thrusterC4.png";
        }
        else if (system.handlers.isThrustDirection(THRUSTER_DIRECTION.PORT_AFT)) {
            return "/img/system/thrusterC3.png";
        }
        return "/img/system/thrusterC1.png";
    }
    advanceTurn(isActive) { }
    getStrategyName() {
        return this.constructor.name;
    }
    deserialize(data) { }
    serialize() {
        return {};
    }
    getFuelRequirement(amount) {
        const fuel = amount * this.thrusterArgs.fuelPerThrust * (1 + amount / 10);
        return Math.round(fuel);
    }
    generatesHeat() {
        return true;
    }
    getHeatPerThrustChanneled(system) {
        let heat = this.thrusterArgs.heatPerThrust;
        heat *=
            1 +
                system.damage
                    .getCriticals()
                    .filter((critical) => critical instanceof ThrustChannelHeatIncreased)
                    .reduce((total, current) => total + current.getHeatIncrease(), 0);
        return heat;
    }
    getHeatGenerated(channeled, system) {
        return channeled * this.getHeatPerThrustChanneled(system);
    }
    getThrustOutput(system) {
        return this.thrusterArgs.output;
    }
    getMaxChannelAmount(system) {
        return this.getThrustOutput(system);
    }
    canChannelAmount(amount, system) {
        return amount <= this.getMaxChannelAmount(system);
    }
    getChannelCost(amount) {
        return amount;
    }
}
