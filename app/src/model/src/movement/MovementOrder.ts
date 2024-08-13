import { addToHexFacing } from "../utils/math";
import RequiredThrust, { SerializedRequiredThrust } from "./RequiredThrust.js";
import { MOVEMENT_TYPE } from "./movementTypes";
import coordinateConverter from "../utils/CoordinateConverter";
import Vector, { IVector } from "../utils/Vector";
import { Offset } from "../hexagon";

export type SerializedMovementOrder = {
  id: string | null;
  type: MOVEMENT_TYPE;
  position: IVector;
  velocity: IVector;
  facing: number;
  rolled: boolean;
  turn: number;
  value: number | boolean;
  requiredThrust: SerializedRequiredThrust;
  index: number;
  evasion: number;
};

class MovementOrder {
  public id: string | null;
  public type: MOVEMENT_TYPE;
  public position!: Vector;
  public velocity!: Vector;
  public facing: number;
  public rolled: boolean;
  public turn: number;
  public value: number | boolean;
  public requiredThrust: RequiredThrust;
  public index: number;
  public evasion: number;

  public static fromData(data: SerializedMovementOrder) {
    return new MovementOrder(
      data.id,
      data.type,
      new Vector(data.position),
      new Vector(data.velocity),
      data.facing,
      data.rolled,
      data.turn,
      data.value,
      new RequiredThrust().deserialize(data.requiredThrust),
      data.index,
      data.evasion
    );
  }
  constructor(
    id: string | null,
    type: MOVEMENT_TYPE,
    position: Vector | Offset,
    velocity: Vector | Offset,
    facing: number,
    rolled: boolean,
    turn: number,
    value: number | boolean = 0,
    requiredThrust: RequiredThrust | null = null,
    index: number = 0,
    evasion: number = 0
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
    this.evasion = evasion;
  }

  round() {
    const position = this.position.round();
    const velocity = this.velocity.round();

    const clone = this.clone();
    clone.setPosition(position);
    clone.setVelocity(velocity);
    return clone;
  }

  setPosition(position: Vector | Offset) {
    if (position instanceof Offset) {
      position = coordinateConverter.fromHexToGame(position);
    }

    this.position = position;
  }

  setVelocity(velocity: Vector | Offset) {
    if (velocity instanceof Offset) {
      velocity = coordinateConverter.fromHexToGame(velocity);
    }

    this.velocity = velocity;
  }

  setEvasion(evasion: number) {
    this.evasion = evasion;
    return this;
  }

  getFacing() {
    return this.facing;
  }

  getPosition() {
    return this.position;
  }

  getVelocity() {
    return this.velocity;
  }

  getHexPosition() {
    return coordinateConverter.fromGameToHex(this.position);
  }

  getHexVelocity() {
    return coordinateConverter.fromGameToHex(this.velocity);
  }

  setRequiredThrust(req: RequiredThrust) {
    this.requiredThrust = req;
    return this;
  }

  setId(id: string | null) {
    this.id = id;
    return this;
  }

  setIndex(index: number) {
    this.index = index;
    return this;
  }

  serialize(): SerializedMovementOrder {
    return {
      id: this.id,
      type: this.type,
      position: this.position.serialize(),
      velocity: this.velocity.serialize(),
      facing: this.facing,
      rolled: this.rolled,
      turn: this.turn,
      value: this.value,
      requiredThrust: this.requiredThrust?.serialize(),
      index: this.index,
      evasion: this.evasion,
    };
  }

  deserialize(data: SerializedMovementOrder) {
    this.id = data.id;
    this.type = data.type;
    this.position = new Vector(data.position);
    this.velocity = new Vector(data.velocity);
    this.facing = data.facing;
    this.rolled = data.rolled;
    this.turn = data.turn;
    this.value = data.value;
    this.index = data.index;
    this.evasion = data.evasion || 0;
    this.requiredThrust = new RequiredThrust().deserialize(data.requiredThrust);

    return this;
  }

  equals(move: MovementOrder) {
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
    return this.type === MOVEMENT_TYPE.SPEED;
  }

  isDeploy() {
    return this.type === MOVEMENT_TYPE.DEPLOY;
  }

  isStart() {
    return this.type === MOVEMENT_TYPE.START;
  }

  isEvade() {
    return this.type === MOVEMENT_TYPE.EVADE;
  }

  isRoll() {
    return this.type === MOVEMENT_TYPE.ROLL;
  }

  isEnd() {
    return this.type === MOVEMENT_TYPE.END;
  }

  isPivot() {
    return this.type === MOVEMENT_TYPE.PIVOT;
  }

  isCancellable() {
    return this.isSpeed() || this.isPivot() || this.isEvade() || this.isRoll();
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
      this.index,
      this.evasion
    );
  }

  isOpposite(move: MovementOrder) {
    switch (move.type) {
      case MOVEMENT_TYPE.SPEED:
        return (
          this.isSpeed() &&
          this.value === addToHexFacing(move.value as number, 3)
        );
      default:
        return false;
    }
  }
}

export default MovementOrder;
