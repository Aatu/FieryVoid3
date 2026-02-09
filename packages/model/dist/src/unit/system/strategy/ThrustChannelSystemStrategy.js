import ShipSystemStrategy from "./ShipSystemStrategy";
import ThrustChannelHeatIncreased from "../criticals/ThrustChannelHeatIncreased";
import { OutputReduced } from "../criticals/index";
import { GAME_PHASE } from "../../../game/gamePhase";
export var THRUSTER_DIRECTION;
(function (THRUSTER_DIRECTION) {
    THRUSTER_DIRECTION[THRUSTER_DIRECTION["FORWARD"] = 0] = "FORWARD";
    THRUSTER_DIRECTION[THRUSTER_DIRECTION["AFT"] = 3] = "AFT";
    THRUSTER_DIRECTION[THRUSTER_DIRECTION["STARBOARD_FORWARD"] = 1] = "STARBOARD_FORWARD";
    THRUSTER_DIRECTION[THRUSTER_DIRECTION["STARBOARD_AFT"] = 2] = "STARBOARD_AFT";
    THRUSTER_DIRECTION[THRUSTER_DIRECTION["PORT_FORWARD"] = 4] = "PORT_FORWARD";
    THRUSTER_DIRECTION[THRUSTER_DIRECTION["PORT_AFT"] = 5] = "PORT_AFT";
    THRUSTER_DIRECTION[THRUSTER_DIRECTION["PIVOT_RIGHT"] = 6] = "PIVOT_RIGHT";
    THRUSTER_DIRECTION[THRUSTER_DIRECTION["PIVOT_LEFT"] = 7] = "PIVOT_LEFT";
    THRUSTER_DIRECTION[THRUSTER_DIRECTION["MANOUVER"] = 8] = "MANOUVER";
})(THRUSTER_DIRECTION || (THRUSTER_DIRECTION = {}));
const directionsToString = {
    [THRUSTER_DIRECTION.FORWARD]: "Thrust forward",
    [THRUSTER_DIRECTION.AFT]: "Thrust aft",
    [THRUSTER_DIRECTION.STARBOARD_FORWARD]: "Thrust starboard",
    [THRUSTER_DIRECTION.STARBOARD_AFT]: "Thrust starboard",
    [THRUSTER_DIRECTION.PORT_FORWARD]: "Thrust port",
    [THRUSTER_DIRECTION.PORT_AFT]: "Thrust port",
    [THRUSTER_DIRECTION.PIVOT_RIGHT]: "Pivot right",
    [THRUSTER_DIRECTION.PIVOT_LEFT]: "Pivot left",
    [THRUSTER_DIRECTION.MANOUVER]: "Roll, Evade",
};
export var THRUSTER_MODE;
(function (THRUSTER_MODE) {
    THRUSTER_MODE["FUSION"] = "fusion";
    THRUSTER_MODE["MANEUVER"] = "maneuver";
    THRUSTER_MODE["CHEMICAL"] = "chemical";
})(THRUSTER_MODE || (THRUSTER_MODE = {}));
class ThrustChannelSystemStrategy extends ShipSystemStrategy {
    direction;
    channeled;
    strategies = [];
    currentMode;
    baseOutput;
    constructor(output, direction, strategies) {
        super();
        this.baseOutput = output;
        if (strategies.length === 0) {
            throw new Error("Thruster needs a thrust strategy");
        }
        this.strategies = strategies;
        this.currentMode = strategies[0];
        this.direction = direction || 0; // 0, 3, [4,5], [1,2], 6
        this.channeled = 0;
    }
    isBoostable(payload, previousResponse = true) {
        if (previousResponse === false) {
            return false;
        }
        return this.currentMode.isBoostable();
    }
    canBoost(payload, previousResponse = true) {
        if (previousResponse === false) {
            return false;
        }
        return this.currentMode.canBoost();
    }
    canChangeMode() {
        return this.strategies.length > 1;
    }
    changeMode() {
        if (!this.canChangeMode()) {
            throw new Error("Check validity first");
        }
        let index = this.strategies.indexOf(this.currentMode);
        if (index === this.strategies.length - 1) {
            index = 0;
        }
        else {
            index++;
        }
        this.currentMode = this.strategies[index];
        this.getSystem().handlers.resetBoost();
    }
    getFuelRequirement(amount = null) {
        if (amount === null) {
            amount = this.channeled;
        }
        return this.currentMode.getFuelRequirement(amount, this.getSystem());
    }
    resetChanneledThrust() {
        this.channeled = 0;
    }
    addChanneledThrust(channel) {
        this.channeled += channel;
    }
    setChanneledThrust(channel) {
        this.channeled = channel;
    }
    getChanneledThrust() {
        return this.channeled;
    }
    getIconText() {
        return this.channeled;
    }
    serialize(payload, previousResponse = []) {
        return {
            ...previousResponse,
            thrustChannelSystemStrategy: {
                channeled: this.channeled,
                currentMode: this.currentMode.getStrategyName(),
                strategies: this.strategies.map((strategy) => strategy.serialize()),
            },
        };
    }
    deserialize(data = {}) {
        this.channeled = data?.thrustChannelSystemStrategy?.channeled ?? 0;
        const currentModeName = data?.thrustChannelSystemStrategy?.currentMode;
        if (currentModeName) {
            const newMode = this.strategies.find((s) => s.getStrategyName() === currentModeName);
            if (!newMode) {
                throw new Error(`Invalid thruster mode ${currentModeName}`);
            }
            this.currentMode = newMode;
        }
        data?.thrustChannelSystemStrategy?.strategies?.forEach((strategyData, i) => {
            this.strategies[i].deserialize(strategyData);
        });
        return this;
    }
    getDirectionString() {
        if (Array.isArray(this.direction)) {
            return this.direction
                .map((direction) => directionsToString[direction])
                .join(", ");
        }
        return directionsToString[this.direction];
    }
    getMessages(payload, previousResponse = []) {
        return [
            ...previousResponse,
            ...this.currentMode.getMessages(this.getSystem()),
            {
                header: "Output",
                value: this.getThrustOutput(undefined, 0).toString(),
            },
            {
                header: "Manouver(s)",
                value: this.getDirectionString(),
            },
            {
                header: "Channeled",
                value: this.channeled.toString(),
            },
            {
                header: "Fuel expended",
                value: this.getFuelRequirement().toString(),
            },
        ];
    }
    getBackgroundImage() {
        return this.currentMode.getBackgroundImage(this.getSystem());
        /*
        if (mode === THRUSTER_MODE.FUSION) {
          if (
            this.callHandler(
              SYSTEM_HANDLERS.isDirection,
              THRUSTER_DIRECTION.AFT,
              false
            )
          ) {
            return "/img/system/thruster2.png";
          } else if (
            this.callHandler(
              SYSTEM_HANDLERS.isDirection,
              THRUSTER_DIRECTION.STARBOARD_AFT,
              false
            )
          ) {
            return "/img/system/thruster4.png";
          } else if (
            this.callHandler(
              SYSTEM_HANDLERS.isDirection,
              THRUSTER_DIRECTION.PORT_AFT,
              false
            )
          ) {
            return "/img/system/thruster3.png";
          }
          return "/img/system/thruster1.png";
        }
          */
    }
    getTooltipMenuButton(payload, previousResponse = []) {
        if (!payload?.myShip) {
            return previousResponse;
        }
        if (this.getSystem().isDisabled()) {
            return previousResponse;
        }
        if (!this.canChangeMode()) {
            return previousResponse;
        }
        return [
            ...previousResponse,
            {
                sort: 50,
                img: "/img/system/thrusterC1.png",
                clickHandler: this.changeMode.bind(this),
            },
        ];
    }
    generatesHeat() {
        return true;
    }
    getHeatGenerated(payload, previousResponse = 0) {
        return (previousResponse +
            this.currentMode.getHeatGenerated(this.channeled, this.getSystem()));
    }
    getThrustDirection(payload, previousResponse = null) {
        return this.direction;
    }
    getThrustOutput(payload, previousResponse = 0) {
        if (this.getSystem().isDisabled()) {
            return previousResponse;
        }
        const boost = this.getSystem().handlers.getBoost();
        let output = this.currentMode.getThrustOutput(this.getSystem(), boost);
        const outputReduction = this.getSystem()
            .damage.getCriticals()
            .filter((critical) => critical instanceof OutputReduced)
            .reduce((total, current) => total + current.getOutputReduction(), 0);
        output = output - outputReduction;
        if (output < 0) {
            output = 0;
        }
        return previousResponse + output;
    }
    getMaxChannelAmount() {
        return this.getThrustOutput(undefined, 0);
    }
    canChannelAmount(amount) {
        return amount <= this.getMaxChannelAmount();
    }
    getChannelCost(amount) {
        return amount;
    }
    isThruster(payload, previousResponse = false) {
        return true;
    }
    isThrustDirection(direction) {
        return (this.direction === direction ||
            (Array.isArray(this.direction) && this.direction.includes(direction)));
    }
    getRequiredPhasesForReceivingPlayerData(payload, previousResponse = GAME_PHASE.GAME) {
        if (previousResponse > GAME_PHASE.GAME) {
            return previousResponse;
        }
        return GAME_PHASE.GAME;
    }
    receivePlayerData({ clientSystem, phase, }) {
        if (phase !== GAME_PHASE.GAME) {
            return;
        }
        if (!clientSystem) {
            return;
        }
        if (this.getSystem().isDisabled()) {
            return;
        }
        const clientStrategy = clientSystem.getStrategiesByInstance(ThrustChannelSystemStrategy)[0];
        const targetMode = clientStrategy.currentMode;
        if (targetMode.equals(this.currentMode)) {
            return;
        }
        const newMode = this.strategies.find((strategy) => strategy.equals(targetMode));
        if (!this.canChangeMode() || !newMode) {
            throw new Error(`This system can not change mode to ${targetMode}`);
        }
        this.currentMode = newMode;
        this.getSystem().handlers.resetBoost();
    }
    advanceTurn() {
        this.channeled = 0;
        this.strategies.forEach((strategy) => {
            const active = this.currentMode === strategy;
            strategy.advanceTurn(active);
        });
    }
    getPossibleCriticals(payload, previousResponse = []) {
        return [
            ...previousResponse,
            { severity: 20, critical: new ThrustChannelHeatIncreased(0.5, 1) },
            {
                severity: 30,
                critical: new OutputReduced(0.25, 2),
            },
            { severity: 40, critical: new ThrustChannelHeatIncreased(0.5, 3) },
            { severity: 60, critical: new ThrustChannelHeatIncreased(0.5) },
            {
                severity: 70,
                critical: new OutputReduced(Math.floor(this.baseOutput / 4)),
            },
            {
                severity: 80,
                critical: new OutputReduced(Math.floor(this.baseOutput / 3)),
            },
            {
                severity: 90,
                critical: new OutputReduced(Math.floor(this.baseOutput / 2)),
            },
        ];
    }
    onSystemOffline() {
        this.onSystemPowerLevelDecrease();
    }
    onSystemPowerLevelIncrease() {
        this.onSystemPowerLevelDecrease();
    }
    onSystemPowerLevelDecrease() {
        if (!this.system ||
            !this.system.shipSystems ||
            !this.system.shipSystems.ship) {
            return;
        }
        this.system.shipSystems.ship.movement.revertMovementsUntilValidMovement();
    }
}
export default ThrustChannelSystemStrategy;
