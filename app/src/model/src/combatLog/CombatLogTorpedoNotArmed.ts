import { ICombatLogEntry } from "./combatLogClasses";

class CombatLogTorpedoNotArmed implements ICombatLogEntry {
  public torpedoFlightId: string;
  public turnsActive: number;
  public armingTime: number;
  public replayOrder: number = 0;

  constructor(
    torpedoFlightId: string,
    turnsActive: number,
    armingTime: number
  ) {
    this.torpedoFlightId = torpedoFlightId;
    this.turnsActive = turnsActive;
    this.armingTime = armingTime;
  }

  serialize(): {
    logEntryClass: string;
    torpedoFlightId: string;
    turnsActive: number;
    armingTime: number;
  } {
    return {
      logEntryClass: this.constructor.name,
      torpedoFlightId: this.torpedoFlightId,
      turnsActive: this.turnsActive,
      armingTime: this.armingTime,
    };
  }

  deserialize(data: {
    logEntryClass: string;
    torpedoFlightId: string;
    turnsActive: number;
    armingTime: number;
  }) {
    this.torpedoFlightId = data.torpedoFlightId;
    this.turnsActive = data.turnsActive;
    this.armingTime = data.armingTime;
    return this;
  }
}

export default CombatLogTorpedoNotArmed;
