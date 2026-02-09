import { DiceRoller } from "../../../../utils/DiceRoller";
import CombatLogDamageEntry from "../../../../combatLog/CombatLogDamageEntry";
import { ShipSystemType } from "../../ShipSystem";
import HitSystemRandomizer from "./utils/HitSystemRandomizer";
import DamageEntry from "../../DamageEntry";
import ShipSystemStrategy from "../ShipSystemStrategy";
export class UnifiedDamageStrategy {
    iterations = 1;
    armorPiercingFormula = 0;
    damageFormula = 0;
    overPenetrationDamageMultiplier = 0;
    damageArmorModifier = 1;
    constructor(args) {
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
    applyDamageFromWeaponFire(payload) {
        const damageArgs = this.getDamageArgs(payload.argsOverrider);
        if (!payload.diceRoller) {
            payload.diceRoller = new DiceRoller();
        }
        if (!payload.hitSystemRandomizer) {
            payload.hitSystemRandomizer = new HitSystemRandomizer();
        }
        let iterations = payload.diceRoller.roll(damageArgs.iterations);
        const combatLogDamageEntry = payload.combatLogDamageEntry || new CombatLogDamageEntry();
        const systemsHit = [];
        while (iterations--) {
            const armorPiercing = payload.diceRoller.roll(damageArgs.armorPiercingFormula);
            this.doDamage(payload, damageArgs, combatLogDamageEntry, systemsHit, null, armorPiercing);
        }
        payload.combatLogEntry.addDamage(combatLogDamageEntry);
    }
    doDamage(payload, damageArgs, combatLogDamageEntry, systemsHit, lastSection, armorPiercing) {
        let hitSystem = payload.hitSystemRandomizer.randomizeHitSystem(this.getValidSystemsForOuterHit(payload.attackPosition, payload.target, lastSection, systemsHit.length > 0));
        if (!hitSystem) {
            return;
        }
        const section = hitSystem.getSection();
        armorPiercing = this.doDamageToSystem(payload.diceRoller, damageArgs, combatLogDamageEntry, hitSystem, Boolean(lastSection), armorPiercing);
        systemsHit.push(hitSystem);
        if (armorPiercing === 0) {
            return;
        }
        // If the first hit is against always targetable system, we don't continue normal penetration
        // Instead we start again from the beginning.
        if (hitSystem.handlers.isAlwaysTargetable() && systemsHit.length === 1) {
            return this.doDamage(payload, damageArgs, combatLogDamageEntry, systemsHit, null, armorPiercing);
        }
        const structure = hitSystem.getStructure();
        if (structure && structure !== hitSystem && !structure.isDestroyed()) {
            hitSystem = structure;
            armorPiercing = this.doDamageToSystem(payload.diceRoller, damageArgs, combatLogDamageEntry, hitSystem, true, armorPiercing);
            systemsHit.push(hitSystem);
            if (armorPiercing === 0) {
                return;
            }
        }
        if (hitSystem.getSystemType() === ShipSystemType.STRUCTURE) {
            hitSystem = payload.hitSystemRandomizer.randomizeHitSystem(this.getValidSystemsForInnerHit(payload.target, section));
            if (hitSystem) {
                armorPiercing = this.doDamageToSystem(payload.diceRoller, damageArgs, combatLogDamageEntry, hitSystem, true, armorPiercing);
                systemsHit.push(hitSystem);
            }
            if (armorPiercing === 0) {
                return;
            }
        }
        this.doDamage(payload, damageArgs, combatLogDamageEntry, systemsHit, section, armorPiercing);
    }
    getDamageArgs(argsOverrider) {
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
    getValidSystemsForOuterHit(shooterPosition, target, lastSection, excludeAlwaysTargetable = false) {
        return target.systems.getSystemsForOuterHit(shooterPosition, lastSection, excludeAlwaysTargetable);
    }
    getValidSystemsForInnerHit(target, section) {
        return target.systems.getSystemsForInnerHit(section);
    }
    doDamageToSystem(diceRoller, damageArgs, combatLogEntry, hitSystem, isPenetrating, armorPiercing) {
        const damageMod = isPenetrating
            ? diceRoller.roll(damageArgs.overPenetrationDamageMultiplier)
            : 1;
        let damage = Math.round(diceRoller.roll(damageArgs.damageFormula) * damageMod);
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
        }
        else {
            entry = new DamageEntry(damage, finalArmor);
            damage = 0;
        }
        hitSystem.addDamage(entry);
        combatLogEntry.add(hitSystem, entry);
        return armorPiercingLeft;
    }
}
export class UnifiedDamageSystemStrategy extends ShipSystemStrategy {
    strategy;
    constructor(args) {
        super();
        this.strategy = new UnifiedDamageStrategy(args);
    }
    applyDamageFromWeaponFire(payload) {
        const ammo = this.getSystem().handlers.getSelectedAmmo();
        this.strategy.applyDamageFromWeaponFire({
            ...payload,
            argsOverrider: ammo || undefined,
        });
    }
}
