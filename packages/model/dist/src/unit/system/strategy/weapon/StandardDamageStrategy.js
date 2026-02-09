import ShipSystemStrategy from "../ShipSystemStrategy";
import HitSystemRandomizer from "./utils/HitSystemRandomizer";
import DamageEntry from "../../DamageEntry";
import CombatLogDamageEntry from "../../../../combatLog/CombatLogDamageEntry";
import { SYSTEM_HANDLERS } from "../types/SystemHandlersTypes";
import CombatLogWeaponFire from "../../../../combatLog/CombatLogWeaponFire";
export const isStandardDamagePayload = (payload) => {
    return payload.combatLogEntry instanceof CombatLogWeaponFire;
};
class StandardDamageStrategy extends ShipSystemStrategy {
    damageFormula;
    armorPiercingFormula;
    hitSystemRandomizer;
    constructor(damageFormula = 0, armorPiercingFormula = 0) {
        super();
        this.damageFormula = damageFormula;
        this.armorPiercingFormula = armorPiercingFormula;
        this.hitSystemRandomizer = new HitSystemRandomizer();
    }
    getTotalBurstSize() {
        return 1;
    }
    getDamageMessage() {
        let messages = [];
        if (this.damageFormula) {
            messages.push(this.damageFormula);
        }
        const ammo = this.getSystem().callHandler(SYSTEM_HANDLERS.getSelectedAmmo, null, null);
        if (ammo) {
            messages.push(ammo.damageFormula);
        }
        return messages.join(" + ammo: ");
    }
    getArmorPiercingMessage() {
        let messages = [];
        if (this.armorPiercingFormula) {
            messages.push(this.armorPiercingFormula);
        }
        const ammo = this.getSystem().callHandler(SYSTEM_HANDLERS.getSelectedAmmo, null, null);
        if (ammo) {
            messages.push(ammo.armorPiercingFormula);
        }
        return messages.join(" + ammo: ");
    }
    getDamageTypeMessage() {
        return "Standard";
    }
    getMessages(payload, previousResponse = []) {
        previousResponse.push({
            header: "Damage type",
            value: this.getDamageTypeMessage(),
        });
        previousResponse.push({
            header: "Damage",
            value: this.getDamageMessage(),
        });
        previousResponse.push({
            header: "Armor piercing",
            value: this.getArmorPiercingMessage(),
        });
        return previousResponse;
    }
    applyDamageFromWeaponFire(payload) {
        if (!isStandardDamagePayload(payload) || !payload.hitResolution) {
            throw new Error("Invalid payload");
        }
        const { shooter, combatLogEntry, hitResolution } = payload;
        const hit = hitResolution.result;
        const result = new CombatLogDamageEntry();
        combatLogEntry.addDamage(result);
        if (hit) {
            combatLogEntry.setShots(1, 1);
            this.doDamage({ shooterPosition: shooter.getPosition(), ...payload }, result, null);
        }
        else {
            combatLogEntry.setShots(0, 1);
        }
    }
    doDamage(payload, damageResult, lastSection, inputArmorPiercing, inputDamage) {
        const { target, shooterPosition } = payload;
        let armorPiercing = inputArmorPiercing === undefined
            ? this.getArmorPiercing(payload)
            : inputArmorPiercing;
        let damage = inputDamage === undefined
            ? this.getDamageForWeaponHit(payload)
            : inputDamage;
        const hitSystem = this.chooseHitSystem({
            target,
            shooterPosition,
            lastSection,
        });
        if (!hitSystem) {
            damageResult.addNote("Unable to find system to hit");
            return;
        }
        let result = this.doDamageToSystem(payload, damageResult, hitSystem, armorPiercing || 0, damage);
        armorPiercing = result.armorPiercing;
        damage = result.damage;
        if (damage === 0) {
            return;
        }
        let overkillSystem = this.findOverkillStructure(hitSystem, target);
        if (!overkillSystem) {
            return this.doDamage(payload, damageResult, target.systems.sections.getSectionBySystem(hitSystem) || null, armorPiercing, damage);
        }
        result = this.doDamageToSystem(payload, damageResult, overkillSystem, armorPiercing, damage);
        armorPiercing = result.armorPiercing;
        damage = result.damage;
        if (damage === 0) {
            return;
        }
        return this.doDamage(payload, damageResult, target.systems.sections.getSectionBySystem(overkillSystem) || null, armorPiercing, damage);
    }
    findOverkillStructure(system, ship) {
        const section = ship.systems.sections.getSectionBySystem(system);
        const structure = section.getStructure();
        if (!structure || structure.id === system.id || structure.isDestroyed()) {
            return null;
        }
        return structure;
    }
    doDamageToSystem(payload, damageResult, hitSystem, armorPiercing, damage) {
        let armor = hitSystem.getArmor();
        let finalArmor = armor - armorPiercing;
        if (finalArmor < 0) {
            finalArmor = 0;
        }
        damage -= finalArmor;
        let armorPiercingLeft = armorPiercing - armor;
        if (armorPiercingLeft < 0) {
            armorPiercingLeft = 0;
        }
        if (damage < 0) {
            damage = 0;
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
        damageResult.add(hitSystem, entry);
        return {
            armorPiercing: armorPiercingLeft,
            damage,
        };
    }
    chooseHitSystem = ({ target, shooterPosition, lastSection, }) => {
        return (this.hitSystemRandomizer.randomizeHitSystem(target.systems.getSystemsForHit(shooterPosition, lastSection)) || null);
    };
    getDamageForWeaponHit(payload) {
        let damage = 0;
        if (Number.isInteger(this.damageFormula)) {
            damage = this.damageFormula;
        }
        else if (this.damageFormula !== null) {
            damage = this.diceRoller.roll(this.damageFormula);
        }
        if (!this.system) {
            return damage;
        }
        const ammo = this.system.callHandler(SYSTEM_HANDLERS.getSelectedAmmo, null, null);
        if (!ammo) {
            return damage;
        }
        return damage + ammo.getDamage(this.diceRoller);
    }
    getArmorPiercing(payload) {
        let armorPiercing = 0;
        if (Number.isInteger(this.armorPiercingFormula)) {
            armorPiercing = this.armorPiercingFormula;
        }
        else if (this.armorPiercingFormula !== null) {
            armorPiercing = this.diceRoller.roll(this.armorPiercingFormula);
        }
        if (!this.system) {
            return armorPiercing;
        }
        const ammo = this.system.callHandler(SYSTEM_HANDLERS.getSelectedAmmo, null, null);
        if (!ammo) {
            return armorPiercing;
        }
        return armorPiercing + ammo.getArmorPiercing(this.diceRoller);
    }
}
export default StandardDamageStrategy;
