import { ICombatLogEntry } from "./combatLogClasses";

class CombatLogTorpedoOutOfTime implements ICombatLogEntry {
  public torpedoFlightId: string;
  public replayOrder: number = 0;

  constructor(torpedoFlightId: string) {
    this.torpedoFlightId = torpedoFlightId;
  }

  serialize(): { logEntryClass: string; torpedoFlightId: string } {
    return {
      logEntryClass: this.constructor.name,
      torpedoFlightId: this.torpedoFlightId,
    };
  }

  deserialize(data: { logEntryClass: string; torpedoFlightId: string }) {
    this.torpedoFlightId = data.torpedoFlightId;
    return this;
  }
}

export default CombatLogTorpedoOutOfTime;
