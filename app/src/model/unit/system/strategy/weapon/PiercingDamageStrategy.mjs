import StandardDamageStrategy from "./StandardDamageStrategy.mjs";
import Structure from "../../structure/Structure.mjs";

class PiercingDamageStrategy extends StandardDamageStrategy {
  constructor(damageFormula, armorPiercingFormula) {
    super(damageFormula, armorPiercingFormula);
  }

  _getDamageTypeMessage() {
    return "Piercing";
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Damage type",
      value: this._getDamageTypeMessage()
    });

    previousResponse.push({
      value:
        "Piercing will cause damage multiple times applying new damage each time, until it runs out of armor piercing." +
        " Piercing will not damage other than structures multiple times."
    });

    previousResponse.push({
      header: "Damage",
      value: this._getDamageMessage()
    });

    previousResponse.push({
      header: "Armor piercing",
      value: this._getArmorPiercingMessage()
    });

    return previousResponse;
  }

  _getNumberOfShots() {
    return this.maxDamages;
  }

  _chooseHitSystem({ target, shooterPosition }, systemsHit) {
    const systems = target.systems
      .getSystemsForHit(shooterPosition)
      .filter(system => !systemsHit.some(hit => system.id === hit.id));
    return this.hitSystemRandomizer.randomizeHitSystem(systems);
  }

  _doDamage(
    payload,
    damageResult,
    armorPiercing = undefined,
    shotsResolved = 0,
    systemsHit = []
  ) {
    const { target, shooterPosition, combatLogEntry } = payload;

    if (armorPiercing === 0) {
      combatLogEntry.addNote(
        `Pierced ${shotsResolved} times. Ran out of armor piercing.`
      );
      return;
    }

    if (armorPiercing === undefined) {
      armorPiercing = this._getArmorPiercing(payload);
    }

    const hitSystem = this._chooseHitSystem(
      {
        target,
        shooterPosition
      },
      systemsHit
    );

    if (!hitSystem) {
      return;
    }

    let result = this._doDamageToSystem(
      payload,
      damageResult,
      hitSystem,
      armorPiercing,
      this._getDamageForWeaponHit(payload)
    );

    armorPiercing = result.armorPiercing;

    if (!(hitSystem instanceof Structure)) {
      systemsHit.push(hitSystem);
    }

    return this._doDamage(
      payload,
      damageResult,
      armorPiercing,
      shotsResolved + 1,
      systemsHit
    );
  }
}

export default PiercingDamageStrategy;
