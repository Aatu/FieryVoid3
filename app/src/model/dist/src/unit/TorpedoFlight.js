import Vector from "../utils/Vector";
import { v4 as uuidv4 } from "uuid";
import coordinateConverter from "../utils/CoordinateConverter";
import { createTorpedoInstance } from "./system/weapon/ammunition";
export var InterceptionPriority;
(function (InterceptionPriority) {
    InterceptionPriority[InterceptionPriority["HIGH"] = 1] = "HIGH";
    InterceptionPriority[InterceptionPriority["MEDIUM"] = 2] = "MEDIUM";
    InterceptionPriority[InterceptionPriority["LOW"] = 3] = "LOW";
})(InterceptionPriority || (InterceptionPriority = {}));
class TorpedoFlight {
    id;
    torpedo;
    targetId;
    shooterId;
    weaponId;
    launchPosition;
    strikePosition;
    intercepted;
    done;
    interceptionPriority = InterceptionPriority.MEDIUM;
    pathStartIndex = 0;
    constructor(torpedo, targetId, shooterId, weaponId) {
        this.id = uuidv4();
        this.torpedo = torpedo;
        this.targetId = targetId;
        this.shooterId = shooterId;
        this.weaponId = weaponId;
        this.launchPosition = new Vector();
        this.strikePosition = new Vector();
        this.intercepted = false;
        this.done = false;
    }
    randomizeStartIndex() {
        this.pathStartIndex = Math.floor(Math.random() * 3);
    }
    getTargetId() {
        return this.targetId;
    }
    getShooterId() {
        return this.shooterId;
    }
    setDone() {
        this.done = true;
    }
    isDone() {
        return this.done;
    }
    isIntercepted() {
        return this.intercepted;
    }
    setIntercepted() {
        this.intercepted = true;
    }
    getStrikeDistance(target) {
        return this.torpedo.getStrikeDistance(this, target);
    }
    setStrikePosition(position) {
        this.strikePosition = position;
        return this;
    }
    getStrikePositionHex() {
        return coordinateConverter.fromGameToHex(this.strikePosition);
    }
    setLaunchPosition(position) {
        this.launchPosition = position;
        return this;
    }
    serialize() {
        return {
            id: this.id,
            torpedo: this.torpedo.constructor.name,
            targetId: this.targetId,
            strikePosition: this.strikePosition,
            shooterId: this.shooterId,
            weaponId: this.weaponId,
            intercepted: this.intercepted,
            launchPosition: this.launchPosition,
        };
    }
    deserialize(data) {
        this.id = data.id;
        this.torpedo = createTorpedoInstance(data.torpedo);
        this.targetId = data.targetId;
        this.strikePosition = new Vector(data.strikePosition);
        this.launchPosition = new Vector(data.launchPosition);
        this.shooterId = data.shooterId;
        this.weaponId = data.weaponId;
        this.intercepted = data.intercepted || false;
        return this;
    }
    static fromData(data) {
        return new TorpedoFlight(createTorpedoInstance(data.torpedo), data.targetId, data.shooterId, data.weaponId).deserialize(data);
    }
    clone() {
        return TorpedoFlight.fromData(this.serialize());
    }
}
export default TorpedoFlight;
