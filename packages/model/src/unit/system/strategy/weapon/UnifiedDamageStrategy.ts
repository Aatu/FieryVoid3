import { Vector } from "three/examples/jsm/Addons.js";
import { DiceRoller, DiceRollFormula } from "../../../../utils/DiceRoller";
import Ship from "../../../Ship";
import CombatLogDamageEntry from "../../../../combatLog/CombatLogDamageEntry";
import SystemSection from "../../systemSection/SystemSection";
import ShipSystem, { ShipSystemType } from "../../ShipSystem";
import HitSystemRandomizer from "./utils/HitSystemRandomizer";
import DamageEntry from "../../DamageEntry";
import { IVector } from "../../../../utils/Vector";
import ShipSystemStrategy from "../ShipSystemStrategy";

export interface IDamageOverrider {
  getDamageOverrider(
    args: UnifiedDamageStrategyArgs
  ): UnifiedDamageStrategyArgs;
}

export type CombatLogEntry = {
  addNote: (note: string) => void;
  addDamage: (damageEntry: CombatLogDamageEntry) => void;
};

export type UnifiedDamagePayload = {
  target: Ship;
  attackPosition: Vector;
  argsOverrider?: IDamageOverrider;
  combatLogEntry: CombatLogEntry;
  diceRoller?: DiceRoller;
  hitSystemRandomizer?: HitSystemRandomizer;
  combatLogDamageEntry?: CombatLogDamageEntry;
};

export type UnifiedDamageStrategyArgs = {
  iterations: DiceRollFormula;
  armorPiercingFormula: DiceRollFormula;
  damageFormula: DiceRollFormula;
  overPenetrationDamageMultiplier: DiceRollFormula;
  damageArmorModifier: DiceRollFormula;
};

export class UnifiedDamageStrategy {
  private iterations: DiceRollFormula = 1;
  private armorPiercingFormula: DiceRollFormula = 0;
  private damageFormula: DiceRollFormula = 0;
  private overPenetrationDamageMultiplier: DiceRollFormula = 0;
  private damageArmorModifier: DiceRollFormula = 1;

  constructor(args?: Partial<UnifiedDamageStrategyArgs>) {
    this.iterations = args?.iterations || this.iterations;
    this.armorPiercingFormula =
      args?.armorPiercingFormula || this.armorPiercingFormula;
    this.damageFormula = args?.damageFormula || this.damageFormula;
    this.overPenetrationDamageMultiplier =
      args?.overPenetrationDamageMultiplier ||
      this.overPenetrationDamageMultiplier;
    this.damageArmorModifier =
      args?.damageArmorModifier || this.damageArmorModifier;
  }

  public applyDamageFromWeaponFire(payload: UnifiedDamagePayload) {
    const damageArgs = this.getDamageArgs(payload.argsOverrider);

    if (!payload.diceRoller) {
      payload.diceRoller = new DiceRoller();
    }

    if (!payload.hitSystemRandomizer) {
      payload.hitSystemRandomizer = new HitSystemRandomizer();
    }

    let iterations = payload.diceRoller.roll(damageArgs.iterations);

    const combatLogDamageEntry =
      payload.combatLogDamageEntry || new CombatLogDamageEntry();
    const systemsHit: ShipSystem[] = [];

    while (iterations--) {
      const armorPiercing = payload.diceRoller.roll(
        damageArgs.armorPiercingFormula
      );
      this.doDamage(
        payload as Required<UnifiedDamagePayload>,
        damageArgs,
        combatLogDamageEntry,
        systemsHit,
        null,
        armorPiercing
      );
    }

    payload.combatLogEntry.addDamage(combatLogDamageEntry);
  }

  protected doDamage(
    payload: Required<UnifiedDamagePayload>,
    damageArgs: UnifiedDamageStrategyArgs,
    combatLogDamageEntry: CombatLogDamageEntry,
    systemsHit: ShipSystem[],
    lastSection: SystemSection | null,
    armorPiercing: number
  ): void {
    let hitSystem = payload.hitSystemRandomizer.randomizeHitSystem(
      this.getValidSystemsForOuterHit(
        payload.attackPosition,
        payload.target,
        lastSection,
        systemsHit.length > 0
      )
    );

    if (!hitSystem) {
      return;
    }

    const section = hitSystem.getSection();

    armorPiercing = this.doDamageToSystem(
      payload.diceRoller,
      damageArgs,
      combatLogDamageEntry,
      hitSystem,
      Boolean(lastSection),
      armorPiercing
    );

    systemsHit.push(hitSystem);

    if (armorPiercing === 0) {
      return;
    }

    // If the first hit is against always targetable system, we don't continue normal penetration
    // Instead we start again from the beginning.
    if (hitSystem.handlers.isAlwaysTargetable() && systemsHit.length === 1) {
      return this.doDamage(
        payload,
        damageArgs,
        combatLogDamageEntry,
        systemsHit,
        null,
        armorPiercing
      );
    }

    const structure = hitSystem.getStructure();

    if (structure && structure !== hitSystem && !structure.isDestroyed()) {
      hitSystem = structure;

      armorPiercing = this.doDamageToSystem(
        payload.diceRoller,
        damageArgs,
        combatLogDamageEntry,
        hitSystem,
        true,
        armorPiercing
      );

      systemsHit.push(hitSystem);

      if (armorPiercing === 0) {
        return;
      }
    }

    if (hitSystem.getSystemType() === ShipSystemType.STRUCTURE) {
      hitSystem = payload.hitSystemRandomizer.randomizeHitSystem(
        this.getValidSystemsForInnerHit(payload.target, section)
      );

      if (hitSystem) {
        armorPiercing = this.doDamageToSystem(
          payload.diceRoller,
          damageArgs,
          combatLogDamageEntry,
          hitSystem,
          true,
          armorPiercing
        );

        systemsHit.push(hitSystem);
      }

      if (armorPiercing === 0) {
        return;
      }
    }

    this.doDamage(
      payload,
      damageArgs,
      combatLogDamageEntry,
      systemsHit,
      section,
      armorPiercing
    );
  }

  protected getDamageArgs(
    argsOverrider?: IDamageOverrider | null
  ): UnifiedDamageStrategyArgs {
    const args = {
      iterations: this.iterations,
      armorPiercingFormula: this.armorPiercingFormula,
      damageFormula: this.damageFormula,
      overPenetrationDamageMultiplier: this.overPenetrationDamageMultiplier,
      damageArmorModifier: this.damageArmorModifier,
    };

    if (argsOverrider) {
      return argsOverrider.getDamageOverrider(args);
    }

    return args;
  }

  protected getValidSystemsForOuterHit(
    shooterPosition: IVector,
    target: Ship,
    lastSection: SystemSection | null,
    excludeAlwaysTargetable: boolean = false
  ) {
    return target.systems.getSystemsForOuterHit(
      shooterPosition,
      lastSection,
      excludeAlwaysTargetable
    );
  }

  protected getValidSystemsForInnerHit(target: Ship, section: SystemSection) {
    return target.systems.getSystemsForInnerHit(section);
  }

  protected doDamageToSystem(
    diceRoller: DiceRoller,
    damageArgs: UnifiedDamageStrategyArgs,
    combatLogEntry: CombatLogDamageEntry,
    hitSystem: ShipSystem,
    isPenetrating: boolean,
    armorPiercing: number
  ): number {
    const damageMod = isPenetrating
      ? diceRoller.roll(damageArgs.overPenetrationDamageMultiplier)
      : 1;
    let damage = Math.round(
      diceRoller.roll(damageArgs.damageFormula) * damageMod
    );

    let armor = hitSystem.getArmor();
    let finalArmor = armor - armorPiercing;
    if (finalArmor < 0) {
      finalArmor = 0;
    }

    damage -= finalArmor * diceRoller.roll(damageArgs.damageArmorModifier);

    let armorPiercingLeft = armorPiercing - armor;
    if (armorPiercingLeft < 0) {
      armorPiercingLeft = 0;
    }

    if (damage <= 0) {
      return armorPiercingLeft;
    }

    let entry = null;

    if (damage > hitSystem.getRemainingHitpoints()) {
      if (hitSystem.getRemainingHitpoints() <= 0) {
        throw new Error("Trying to damage destroyed system");
      }

      entry = new DamageEntry(hitSystem.getRemainingHitpoints(), finalArmor);
      damage -= hitSystem.getRemainingHitpoints();
    } else {
      entry = new DamageEntry(damage, finalArmor);

      damage = 0;
    }

    hitSystem.addDamage(entry);
    combatLogEntry.add(hitSystem, entry);

    return armorPiercingLeft;
  }
}

export class UnifiedDamageSystemStrategy extends ShipSystemStrategy {
  private strategy: UnifiedDamageStrategy;

  constructor(args?: Partial<UnifiedDamageStrategyArgs>) {
    super();

    this.strategy = new UnifiedDamageStrategy(args);
  }

  public applyDamageFromWeaponFire(payload: UnifiedDamagePayload) {
    const ammo = this.getSystem().handlers.getSelectedAmmo();
    this.strategy.applyDamageFromWeaponFire({
      ...payload,
      argsOverrider: ammo || undefined,
    });
  }
}
