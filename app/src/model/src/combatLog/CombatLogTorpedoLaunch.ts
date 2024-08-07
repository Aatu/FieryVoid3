import { ICombatLogEntry } from "./combatLogClasses";

class CombatLogTorpedoLaunch implements ICombatLogEntry {
  public torpedoFlightId: string;
  public replayOrder: number;

  constructor(torpedoFlightId: string) {
    this.torpedoFlightId = torpedoFlightId;
    this.replayOrder = 15;
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

export default CombatLogTorpedoLaunch;
