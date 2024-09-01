import { ICombatLogEntry } from "./combatLogClasses";

class CombatLogShipVelocity implements ICombatLogEntry {
  public shipId: string;
  public replayOrder: number;

  constructor(shipId: string) {
    this.shipId = shipId;
    this.replayOrder = 10;
  }

  serialize(): { logEntryClass: string; shipId: string } {
    return {
      logEntryClass: this.constructor.name,
      shipId: this.shipId,
    };
  }

  deserialize(unknownData: Record<string, unknown>) {
    const data = unknownData as { logEntryClass: string; shipId: string };
    this.shipId = data.shipId;
    return this;
  }
}

export default CombatLogShipVelocity;
