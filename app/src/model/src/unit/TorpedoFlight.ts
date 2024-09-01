import Vector from "../utils/Vector";
import { v4 as uuidv4 } from "uuid";
import Torpedo from "./system/weapon/ammunition/torpedo/Torpedo";
import Ship from "./Ship";

import coordinateConverter from "../utils/CoordinateConverter";
import { createTorpedoInstance, TorpedoType } from "./system/weapon/ammunition";

export type SerializedTorpedoFlight = {
  id: string;
  torpedo: TorpedoType;
  targetId: string;
  strikePosition: Vector;
  shooterId: string;
  weaponId: number;
  intercepted: boolean;
  launchPosition: Vector;
};

export enum InterceptionPriority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

class TorpedoFlight {
  public id: string;
  public torpedo: Torpedo;
  public targetId: string;
  public shooterId: string;
  public weaponId: number;
  public launchPosition: Vector;
  public strikePosition: Vector;
  public intercepted: boolean;
  public done: boolean;
  public interceptionPriority: InterceptionPriority =
    InterceptionPriority.MEDIUM;
  public pathStartIndex: number = 0;

  constructor(
    torpedo: Torpedo,
    targetId: string,
    shooterId: string,
    weaponId: number
  ) {
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

  public randomizeStartIndex() {
    this.pathStartIndex = Math.floor(Math.random() * 3);
  }

  getTargetId() {
    return this.targetId;
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

  getStrikeDistance(target: Ship) {
    return this.torpedo.getStrikeDistance(this, target);
  }

  setStrikePosition(position: Vector) {
    this.strikePosition = position;
    return this;
  }

  getStrikePositionHex() {
    return coordinateConverter.fromGameToHex(this.strikePosition);
  }

  setLaunchPosition(position: Vector) {
    this.launchPosition = position;
    return this;
  }

  serialize(): SerializedTorpedoFlight {
    return {
      id: this.id,
      torpedo: this.torpedo.constructor.name as TorpedoType,
      targetId: this.targetId,
      strikePosition: this.strikePosition,
      shooterId: this.shooterId,
      weaponId: this.weaponId,
      intercepted: this.intercepted,
      launchPosition: this.launchPosition,
    };
  }

  deserialize(data: SerializedTorpedoFlight) {
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

  public static fromData(data: SerializedTorpedoFlight): TorpedoFlight {
    return new TorpedoFlight(
      createTorpedoInstance(data.torpedo),
      data.targetId,
      data.shooterId,
      data.weaponId
    ).deserialize(data);
  }

  clone() {
    return TorpedoFlight.fromData(this.serialize());
  }
}

export default TorpedoFlight;
