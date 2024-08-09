import Vector from "../utils/Vector";
import { v4 as uuidv4 } from "uuid";
import Torpedo from "./system/weapon/ammunition/torpedo/Torpedo";
import Ship from "./Ship";
import {
  createTorpedoInstance,
  TropedoType,
} from "./system/weapon/ammunition/torpedo";

export type SerializedTorpedoFlight = {
  id: string;
  torpedo: TropedoType;
  targetId: string;
  strikePosition: Vector;
  shooterId: string;
  weaponId: number;
  launcherIndex: number;
  intercepted: boolean;
  launchPosition: Vector;
};

class TorpedoFlight {
  public id: string;
  public torpedo: Torpedo;
  public targetId: string;
  public shooterId: string;
  public weaponId: number;
  public launcherIndex: number;
  public launchPosition: Vector;
  public strikePosition: Vector;
  public intercepted: boolean;
  public done: boolean;

  constructor(
    torpedo: Torpedo,
    targetId: string,
    shooterId: string,
    weaponId: number,
    launcherIndex: number
  ) {
    this.id = uuidv4();
    this.torpedo = torpedo;
    this.targetId = targetId;
    this.shooterId = shooterId;
    this.weaponId = weaponId;
    this.launcherIndex = launcherIndex;
    this.launchPosition = new Vector();
    this.strikePosition = new Vector();
    this.intercepted = false;
    this.done = false;
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

  setLaunchPosition(position: Vector) {
    this.launchPosition = position;
    return this;
  }

  serialize(): SerializedTorpedoFlight {
    return {
      id: this.id,
      torpedo: this.torpedo.constructor.name as TropedoType,
      targetId: this.targetId,
      strikePosition: this.strikePosition,
      shooterId: this.shooterId,
      weaponId: this.weaponId,
      launcherIndex: this.launcherIndex,
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
    this.launcherIndex = data.launcherIndex;
    this.intercepted = data.intercepted || false;

    return this;
  }

  public static fromData(data: SerializedTorpedoFlight): TorpedoFlight {
    return new TorpedoFlight(
      createTorpedoInstance(data.torpedo),
      data.targetId,
      data.shooterId,
      data.weaponId,
      data.launcherIndex
    ).deserialize(data);
  }

  clone() {
    return TorpedoFlight.fromData(this.serialize());
  }
}

export default TorpedoFlight;
