import { GAME_PHASE } from "../../../game/gamePhase";
import ShipSystemStrategy from "./ShipSystemStrategy";
import { SYSTEM_HANDLERS } from "./types/SystemHandlersTypes";
class BoostableSystemStrategy extends ShipSystemStrategy {
    power;
    maxLevel;
    boostLevel;
    constructor(power = 0, maxLevel = null) {
        super();
        this.power = power;
        this.maxLevel = maxLevel;
        this.boostLevel = 0;
    }
    isBoostable(payload, previousResponse = true) {
        if (previousResponse === false) {
            return false;
        }
        return this.maxLevel !== 0;
    }
    canBoost(payload, previousResponse = true) {
        if (previousResponse === false) {
            return false;
        }
        const remainginPower = this.getSystem()
            .getShipSystems()
            .power.getRemainingPowerOutput();
        if (this.getSystem().isDisabled()) {
            return false;
        }
        if (this.maxLevel !== null && this.boostLevel >= this.maxLevel) {
            return false;
        }
        return remainginPower >= this.getPowerRequiredForBoost(undefined, 0);
    }
    canDeBoost(payload, previousResponse) {
        return this.boostLevel > 0;
    }
    getPowerRequiredForBoost(payload, previousResponse = 0) {
        return this.power + previousResponse;
    }
    getBoost(payload, previousResponse = 0) {
        if (this.getSystem().isDisabled()) {
            return previousResponse;
        }
        return previousResponse + this.boostLevel;
    }
    getPowerRequirement(payload, previousResponse = 0) {
        if (this.getSystem().isDisabled()) {
            return previousResponse;
        }
        const power = this.boostLevel * this.power;
        return power + previousResponse;
    }
    boost(payload, previousResponse) {
        if (!this.canBoost(payload)) {
            return false;
        }
        this.boostLevel++;
        this.getSystem().callHandler(SYSTEM_HANDLERS.onSystemPowerLevelIncrease, undefined, 0);
    }
    deBoost(payload, previousResponse) {
        if (this.boostLevel === 0) {
            return false;
        }
        this.boostLevel--;
        this.getSystem().callHandler(SYSTEM_HANDLERS.onSystemPowerLevelDecrease, undefined, undefined);
    }
    resetBoost() {
        this.boostLevel = 0;
        this.getSystem().callHandler(SYSTEM_HANDLERS.onSystemPowerLevelDecrease, undefined, undefined);
    }
    getRequiredPhasesForReceivingPlayerData(payload, previousResponse = 1) {
        if (previousResponse > GAME_PHASE.GAME) {
            return previousResponse;
        }
        return GAME_PHASE.GAME;
    }
    receivePlayerData({ clientSystem, phase, }) {
        if (!clientSystem) {
            return;
        }
        if (this.getSystem().isDisabled()) {
            return;
        }
        const clientStrategy = clientSystem.getStrategiesByInstance(BoostableSystemStrategy)[0];
        const targetBoostlevel = clientStrategy?.boostLevel;
        if (this.boostLevel > targetBoostlevel) {
            while (true) {
                if (this.boostLevel === targetBoostlevel) {
                    return;
                }
                if (!this.canDeBoost(undefined, true)) {
                    return;
                }
                this.deBoost(undefined, undefined);
            }
        }
        else if (this.boostLevel < targetBoostlevel) {
            while (true) {
                if (this.boostLevel === targetBoostlevel) {
                    return;
                }
                if (!this.canBoost(undefined, true)) {
                    return;
                }
                this.boost(undefined, undefined);
            }
        }
    }
    getTooltipMenuButton(payload, previousResponse = []) {
        if (!payload?.myShip) {
            return previousResponse;
        }
        if (this.getSystem().isDisabled() ||
            !this.getSystem().handlers.isBoostable()) {
            return previousResponse;
        }
        return [
            ...previousResponse,
            {
                sort: 100,
                img: "/img/plus.png",
                clickHandler: () => this.getSystem().handlers.boost(),
                disabledHandler: () => !this.getSystem().handlers.canBoost(),
            },
            {
                sort: 100,
                img: "/img/minus.png",
                clickHandler: () => this.getSystem().handlers.deBoost(),
                disabledHandler: () => !this.getSystem().handlers.canDeBoost(),
            },
        ];
    }
    serialize(payload, previousResponse = {}) {
        return {
            ...previousResponse,
            boostableSystemStrategy: {
                boostLevel: this.boostLevel,
            },
        };
    }
    deserialize(data) {
        this.boostLevel = data.boostableSystemStrategy?.boostLevel ?? 0;
        return this;
    }
}
export default BoostableSystemStrategy;
