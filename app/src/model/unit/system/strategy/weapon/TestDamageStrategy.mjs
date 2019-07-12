import StandardDamageStrategy from "./StandardDamageStrategy.mjs";
import Reactor from "../../reactor/Reactor.mjs";

class TestDamageStrategy extends StandardDamageStrategy {
  constructor(damage) {
    super();

    this.damage = damage;
  }

  getDamageForWeaponHit({ requiredToHit, rolledToHit }) {
    return this.damage;
  }

  chooseHitSystem({ target, shooter }) {
    const systems = target.systems.getSystemsForHit(shooter.getPosition());
    return systems.find(system => system instanceof Reactor);
  }

  applyArmorPiercing({ armor }) {
    return 0;
  }
}

export default TestDamageStrategy;
