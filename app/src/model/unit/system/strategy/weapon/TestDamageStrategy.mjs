import StandardDamageStrategy from "./StandardDamageStrategy.mjs";
import Reactor from "../../reactor/Reactor.mjs";

class TestDamageStrategy extends StandardDamageStrategy {
  constructor(damage) {
    super();

    this.damage = damage;
  }

  _getDamageForWeaponHit({ requiredToHit, rolledToHit }) {
    return this.damage;
  }

  _chooseHitSystem({ target, shooter }) {
    const systems = target.systems.getSystemsForHit(shooter.getPosition());
    return systems.find(system => system instanceof Reactor);
  }

  _applyArmorPiercing({ damage }) {
    return {
      armor: 0,
      armorPiercing: 0,
      finalDamage: damage
    };
  }
}

export default TestDamageStrategy;
