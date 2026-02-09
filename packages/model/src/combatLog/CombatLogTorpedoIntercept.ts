import WeaponHitChance, {
  SerializedWeaponHitChance,
} from "../weapon/WeaponHitChance";
import { ICombatLogEntry } from "./combatLogClasses";

export type SerializedCombatLogTorpedoIntercept = {
  logEntryClass: string;
  torpedoFlightId: string;
  intercepts: {
    shipId: string;
    interceptorId: number;
    hitChance: SerializedWeaponHitChance;
    roll: number;
    success: boolean;
  }[];
};

type Intercept = {
  shipId: string;
  interceptorId: number;
  hitChance: WeaponHitChance;
  roll: number;
  success: boolean;
};

class CombatLogTorpedoIntercept implements ICombatLogEntry {
  public torpedoFlightId: string;
  public replayOrder: number = 0;
  public intercepts: Intercept[] = [];

  constructor(torpedoFlightId: string) {
    this.torpedoFlightId = torpedoFlightId;
  }

  addIntercept(intercept: Intercept) {
    this.intercepts.push(intercept);
  }

  isSucessfull() {
    return this.intercepts.some((i) => i.success);
  }

  serialize(): SerializedCombatLogTorpedoIntercept {
    return {
      logEntryClass: this.constructor.name,
      torpedoFlightId: this.torpedoFlightId,
      intercepts: this.intercepts.map((i) => ({
        shipId: i.shipId,
        interceptorId: i.interceptorId,
        hitChance: i.hitChance.serialize(),
        roll: i.roll,
        success: i.success,
      })),
    };
  }

  deserialize(unknownData: Record<string, unknown>) {
    const data = unknownData as SerializedCombatLogTorpedoIntercept;

    this.torpedoFlightId = data.torpedoFlightId;
    this.intercepts = data.intercepts.map((i) => ({
      shipId: i.shipId,
      interceptorId: i.interceptorId,
      hitChance: new WeaponHitChance().deserialize(i.hitChance),
      roll: i.roll,
      success: i.success,
    }));

    return this;
  }
}

export default CombatLogTorpedoIntercept;
