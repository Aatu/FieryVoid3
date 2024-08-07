import { ICombatLogEntry } from "./combatLogClasses";

class CombatLogShipMovement implements ICombatLogEntry {
  public shipId: string;
  public replayOrder: number;

  constructor(shipId: string) {
    this.shipId = shipId;
    this.replayOrder = 20;
  }

  serialize(): { logEntryClass: string; shipId: string } {
    return {
      logEntryClass: this.constructor.name,
      shipId: this.shipId,
    };
  }

  deserialize(data: { logEntryClass: string; shipId: string }) {
    this.shipId = data.shipId;
    return this;
  }
}

export default CombatLogShipMovement;
