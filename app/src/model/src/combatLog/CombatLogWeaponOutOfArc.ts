import { ICombatLogEntry } from "./combatLogClasses";

class CombatLogWeaponOutOfArc implements ICombatLogEntry {
  public fireOrderId: string;
  public replayOrder: number = 0;

  constructor(fireOrderId: string) {
    this.fireOrderId = fireOrderId;
  }

  serialize(): { logEntryClass: string; fireOrderId: string } {
    return {
      logEntryClass: this.constructor.name,
      fireOrderId: this.fireOrderId,
    };
  }

  deserialize(data: { logEntryClass: string; fireOrderId: string }) {
    this.fireOrderId = data.fireOrderId;
    return this;
  }
}

export default CombatLogWeaponOutOfArc;
