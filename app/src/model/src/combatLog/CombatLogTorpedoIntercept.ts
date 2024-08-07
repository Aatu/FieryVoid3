import WeaponHitChance, {
  SerializedWeaponHitChance,
} from "../weapon/WeaponHitChance";
import { ICombatLogEntry } from "./combatLogClasses";

export type SerializedCombatLogTorpedoIntercept = {
  logEntryClass: string;
  torpedoFlightId: string;
  weaponId: number;
  roll: number;
  shipId: string;
  interceptChange: SerializedWeaponHitChance;
};

class CombatLogTorpedoIntercept implements ICombatLogEntry {
  public torpedoFlightId: string;
  public shipId: string;
  public weaponId: number;
  public interceptChange: WeaponHitChance;
  public roll: number;
  public replayOrder: number = 0;

  constructor(
    torpedoFlightId: string,
    shipId: string,
    weaponId: number,
    interceptChange: WeaponHitChance,
    roll: number
  ) {
    this.torpedoFlightId = torpedoFlightId;
    this.shipId = shipId;
    this.weaponId = weaponId;
    this.interceptChange = interceptChange;
    this.roll = roll;
  }

  isSucessfull() {
    return this.roll <= this.interceptChange.result;
  }

  serialize(): SerializedCombatLogTorpedoIntercept {
    return {
      logEntryClass: this.constructor.name,
      torpedoFlightId: this.torpedoFlightId,
      weaponId: this.weaponId,
      roll: this.roll,
      shipId: this.shipId,
      interceptChange: this.interceptChange.serialize(),
    };
  }

  deserialize(data: SerializedCombatLogTorpedoIntercept) {
    this.torpedoFlightId = data.torpedoFlightId;
    this.weaponId = data.weaponId;
    this.roll = data.roll;
    this.shipId = data.shipId;
    this.interceptChange = new WeaponHitChance().deserialize(
      data.interceptChange
    );
    return this;
  }
}

export default CombatLogTorpedoIntercept;
