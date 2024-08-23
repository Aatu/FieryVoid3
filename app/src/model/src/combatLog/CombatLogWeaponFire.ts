import Ship from "../unit/Ship";
import DamageEntry from "../unit/system/DamageEntry";
import ShipSystem from "../unit/system/ShipSystem";
import Ammo from "../unit/system/weapon/ammunition/Ammo";
import { ICombatLogEntry } from "./combatLogClasses";
import CombatLogDamageEntry, {
  SerializedCombatLogDamageEntry,
} from "./CombatLogDamageEntry";
import CombatLogWeaponFireHitResult, {
  SerializedCombatLogWeaponFireHitResult,
} from "./CombatLogWeaponFireHitResult";

export type SerializedCombatLogWeaponFire = {
  logEntryClass: string;
  fireOrderId: string;
  targetId: string;
  shooterId: string;
  damages: SerializedCombatLogDamageEntry[];
  notes: string[];
  hitResult: SerializedCombatLogWeaponFireHitResult | null;
  shotsHit: number;
  totalShots: number;
  ammoName: string | null;
};

class CombatLogWeaponFire implements ICombatLogEntry {
  public fireOrderId: string;
  public targetId: string;
  public shooterId: string;
  public damages: CombatLogDamageEntry[];
  public notes: string[];
  public hitResult: CombatLogWeaponFireHitResult | null;
  public shotsHit: number = 0;
  public totalShots: number = 0;
  public ammoName: string | null;
  public replayOrder: number = 0;

  public static fromData(
    data: SerializedCombatLogWeaponFire
  ): CombatLogWeaponFire {
    return new CombatLogWeaponFire(
      data.fireOrderId,
      data.targetId,
      data.shooterId,
      null
    ).deserialize(data);
  }

  constructor(
    fireOrderId: string,
    targetId: string,
    shooterId: string,
    ammo: Ammo | null
  ) {
    this.fireOrderId = fireOrderId;
    this.targetId = targetId;
    this.shooterId = shooterId;
    this.damages = [];
    this.notes = [];
    this.hitResult = null;
    this.ammoName = ammo ? ammo.getShortDisplayName() : null;
  }

  addNote(note: string) {
    this.notes.push(note);
  }

  addDamage(damageEntry: CombatLogDamageEntry) {
    this.damages.push(damageEntry);
  }

  addHitResult(hitResult: CombatLogWeaponFireHitResult) {
    this.hitResult = hitResult;
  }

  getHitResult(): CombatLogWeaponFireHitResult {
    if (!this.hitResult) {
      throw new Error("No hit result found");
    }

    return this.hitResult;
  }

  setShots(shotsHit: number, totalShots: number) {
    this.shotsHit = shotsHit;
    this.totalShots = totalShots;
  }

  causedDamage() {
    return this.damages.length > 0;
  }

  getDamages(target: Ship): DamageEntry[] {
    const reduceDamageEntries = (
      all: DamageEntry[],
      entry: { systemId: number; damageIds: string[] }
    ): DamageEntry[] => {
      const system = target.systems.getSystemById(entry.systemId);

      return [
        ...all,
        ...(entry.damageIds
          .map((id) => system.damage.getDamageById(id))
          .filter(Boolean) as DamageEntry[]),
      ];
    };

    return this.damages.reduce((all, current) => {
      return [
        ...all,
        ...current.entries.reduce(reduceDamageEntries, [] as DamageEntry[]),
      ];
    }, [] as DamageEntry[]);
  }

  getDestroyedSystems(target: Ship): ShipSystem[] {
    return this.getDamages(target)
      .filter((damage) => damage.destroyedSystem)
      .map((damage) => damage.system) as ShipSystem[];
  }

  serialize(): SerializedCombatLogWeaponFire {
    return {
      logEntryClass: this.constructor.name,
      fireOrderId: this.fireOrderId,
      targetId: this.targetId,
      shooterId: this.shooterId,
      damages: this.damages.map((damage) => damage.serialize()),
      notes: this.notes,
      hitResult: this.hitResult ? this.hitResult.serialize() : null,
      shotsHit: this.shotsHit,
      totalShots: this.totalShots,
      ammoName: this.ammoName,
    };
  }

  deserialize(data: SerializedCombatLogWeaponFire) {
    this.fireOrderId = data.fireOrderId;
    this.targetId = data.targetId;
    this.shooterId = data.shooterId;
    this.damages = data.damages.map((damage) =>
      new CombatLogDamageEntry().deserialize(damage)
    );

    this.notes = data.notes || [];

    this.hitResult = data.hitResult
      ? CombatLogWeaponFireHitResult.fromData(data.hitResult)
      : null;

    this.shotsHit = data.shotsHit || 0;
    this.totalShots = data.totalShots || 0;

    this.ammoName = data.ammoName || null;

    return this;
  }
}

export default CombatLogWeaponFire;
