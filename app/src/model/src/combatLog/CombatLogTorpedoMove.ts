import Vector from "../utils/Vector";
import { ICombatLogEntry } from "./combatLogClasses";

export type SerializedCombatLogTorpedoMove = {
  logEntryClass: string;
  torpedoFlightId: string;
  startPosition: Vector;
  endPosition: Vector;
  velocity: Vector;
};

class CombatLogTorpedoMove implements ICombatLogEntry {
  public torpedoFlightId: string;
  public startPosition: Vector;
  public endPosition: Vector;
  public velocity: Vector;
  public replayOrder: number;

  constructor(
    torpedoFlightId: string,
    startPosition: Vector,
    endPosition: Vector,
    velocity: Vector
  ) {
    this.torpedoFlightId = torpedoFlightId;
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.velocity = velocity;

    this.replayOrder = 30;
  }

  serialize(): SerializedCombatLogTorpedoMove {
    return {
      logEntryClass: this.constructor.name,
      torpedoFlightId: this.torpedoFlightId,
      startPosition: this.startPosition,
      endPosition: this.endPosition,
      velocity: this.velocity,
    };
  }

  deserialize(data: SerializedCombatLogTorpedoMove) {
    this.torpedoFlightId = data.torpedoFlightId;
    this.startPosition = new Vector(data.startPosition);
    this.endPosition = new Vector(data.endPosition);
    this.velocity = new Vector(data.velocity);
    return this;
  }
}

export default CombatLogTorpedoMove;
