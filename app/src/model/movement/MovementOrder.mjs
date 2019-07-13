import Vector from "../../model/utils/Vector.mjs";
import coordinateConverter from "../../model/utils/CoordinateConverter.mjs";
import { movementTypes } from "./index.mjs";
import hexagon from "../hexagon/index.mjs";
import { addToHexFacing } from "../utils/math.mjs";
import RequiredThrust from "./RequiredThrust.mjs";

class MovementOrder {
  constructor(
    id,
    type,
    position,
    velocity,
    facing,
    rolled,
    turn,
    value = 0,
    requiredThrust = undefined,
    index = 0
  ) {
    this.id = id;
    this.type = type;
    this.facing = facing;
    this.rolled = rolled;
    this.turn = turn;
    this.value = value;
    this.requiredThrust = requiredThrust || new RequiredThrust();
    this.index = index;
    this.setPosition(position);
    this.setVelocity(velocity);
  }

  round() {
    const position = this.position.round();
    const velocity = this.velocity.round();

    const clone = this.clone();
    clone.setPosition(position);
    clone.setVelocity(velocity);
    return clone;
  }

  setPosition(position) {
    if (position instanceof hexagon.Offset) {
      position = coordinateConverter.fromHexToGame(position);
    }

    this.position = position;
  }

  setVelocity(velocity) {
    if (velocity instanceof hexagon.Offset) {
      velocity = coordinateConverter.fromHexToGame(velocity);
    }

    this.velocity = velocity;
  }

  getFacing() {
    return this.facing;
  }

  getPosition() {
    return this.position;
  }

  getHexPosition() {
    return coordinateConverter.fromGameToHex(this.position);
  }

  getHexVelocity() {
    return coordinateConverter.fromGameToHex(this.velocity);
  }

  setRequiredThrust(req) {
    this.requiredThrust = req;
    return this;
  }

  setId(id) {
    this.id = id;
    return this;
  }

  setIndex(index) {
    this.index = index;
    return this;
  }

  serialize() {
    return {
      id: this.id,
      type: this.type,
      position: this.position.serialize(),
      velocity: this.velocity.serialize(),
      facing: this.facing,
      rolled: this.rolled,
      turn: this.turn,
      value: this.value,
      requiredThrust: this.requiredThrust.serialize(),
      index: this.index
    };
  }

  deserialize(data) {
    this.id = data.id;
    this.type = data.type;
    this.position = new Vector(data.position);
    this.velocity = new Vector(data.velocity);
    this.facing = data.facing;
    this.rolled = data.rolled;
    this.turn = data.turn;
    this.value = data.value;
    this.index = data.index;
    this.requiredThrust = new RequiredThrust().deserialize(data.requiredThrust);

    return this;
  }

  equals(move) {
    return (
      this.type === move.type &&
      this.position
        .roundToHexCenter()
        .equals(move.position.roundToHexCenter()) &&
      this.velocity
        .roundToHexCenter()
        .equals(move.velocity.roundToHexCenter()) &&
      this.facing === move.facing &&
      this.rolled === move.rolled &&
      this.turn === move.turn &&
      this.value === move.value
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
      this.velocity,
      this.facing,
      this.rolled,
      this.turn,
      this.value,
      this.requiredThrust,
      this.index
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
