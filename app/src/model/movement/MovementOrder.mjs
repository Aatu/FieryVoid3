import THREE from "three";
import { movementTypes } from ".";
import hexagon from "../hexagon";
import { addToHexFacing } from "../utils/math";
import RequiredThrust from "./RequiredThrust.mjs";

class MovementOrder {
  constructor(
    id,
    type,
    position,
    target,
    facing,
    rolled,
    turn,
    value = 0,
    positionOffset = new THREE.Vector3(),
    targetOffset = new THREE.Vector3(),
    requiredThrust = undefined
  ) {
    if (position && !(position instanceof hexagon.Offset)) {
      throw new Error("MovementOrder requires position as offset hexagon");
    }

    if (target && !(target instanceof hexagon.Offset)) {
      throw new Error("MovementOrder requires target as offset hexagon");
    }

    this.id = id;
    this.type = type;
    this.position = position;
    this.positionOffset = positionOffset;
    this.target = target;
    this.targetOffset = targetOffset;
    this.facing = facing;
    this.rolled = rolled;
    this.turn = turn;
    this.value = value;
    this.requiredThrust = requiredThrust || new RequiredThrust();
  }

  setPositionOffset(position) {
    this.positionOffset = position;
    return this;
  }

  setTargetOffset(position) {
    this.targetOffset = position;
    return this;
  }

  setTarget(target) {
    this.target = hexagon.Offset(target);
  }

  setRequiredThrust(req) {
    this.requiredThrust = req;
    return this;
  }

  setId(id) {
    this.id = id;
    return this;
  }

  serialize() {
    return {
      id: this.id,
      type: this.type,
      position: this.position,
      target: this.target,
      facing: this.facing,
      rolled: this.rolled,
      turn: this.turn,
      value: this.value,
      requiredThrust: this.requiredThrust.serialize(),
      positionOffset: { x: this.positionOffset.x, y: this.positionOffset.y },
      targetOffset: { x: this.targetOffset.x, y: this.targetOffset.y }
    };
  }

  deserialize(data) {
    this.id = data.id;
    this.type = data.type;
    this.position = new hexagon.Offset(data.position);
    this.target = new hexagon.Offset(data.target);
    this.facing = data.facing;
    this.rolled = data.rolled;
    this.turn = data.turn;
    this.value = data.value;
    this.requiredThrust = new RequiredThrust().deserialize(data.requiredThrust);

    this.positionOffset = data.positionOffset
      ? new THREE.Vector3(data.positionOffset.x, data.positionOffset.y)
      : new THREE.Vector3();
    this.targetOffset = data.targetOffset
      ? new THREE.Vector3(data.targetOffset.x, data.targetOffset.y)
      : new THREE.Vector3();

    return this;
  }

  equals(move) {
    return (
      this.type === move.type &&
      this.position.equals(move.position) &&
      this.target.equals(move.target) &&
      this.facing === move.facing &&
      this.rolled === move.rolled &&
      this.turn === move.turn &&
      this.value === move.value &&
      this.positionOffset.equals(move.positionOffset) &&
      this.targetOffset.equals(move.targetOffset)
    );
  }

  isSpeed() {
    return this.type === movementTypes.SPEED;
  }

  isDeploy() {
    return this.type === movementTypes.DEPLOY;
  }

  isStart() {
    return this.type === movementTypes.START;
  }

  isEvade() {
    return this.type === movementTypes.EVADE;
  }

  isRoll() {
    return this.type === movementTypes.ROLL;
  }

  isEnd() {
    return this.type === movementTypes.END;
  }

  isPivot() {
    return this.type === movementTypes.PIVOT;
  }

  isCancellable() {
    return this.isSpeed() || this.isPivot();
  }

  isPlayerAdded() {
    return this.isSpeed() || this.isPivot() || this.isEvade() || this.isRoll();
  }

  clone() {
    return new MovementOrder(
      this.id,
      this.type,
      this.position,
      this.target,
      this.facing,
      this.rolled,
      this.turn,
      this.value,
      this.positionOffset,
      this.targetOffset,
      this.requiredThrust
    );
  }

  isOpposite(move) {
    switch (move.type) {
      case movementTypes.SPEED:
        return this.isSpeed() && this.value === addToHexFacing(move.value, 3);
      default:
        return false;
    }
  }
}

export default MovementOrder;
