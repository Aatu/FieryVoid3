import StandardDamageStrategy, {
  ChooseHitSystemFunction,
} from "./StandardDamageStrategy";
import Reactor from "../../reactor/Reactor";
import Ship from "../../../Ship";
import Vector from "../../../../utils/Vector";

class TestDamageStrategy extends StandardDamageStrategy {
  public damage: number;

  constructor(damage: number) {
    super();

    this.damage = damage;
  }

  getDamageForWeaponHit({}) {
    return this.damage;
  }

  chooseHitSystem: ChooseHitSystemFunction<undefined> = ({
    target,
    shooterPosition,
  }: {
    target: Ship;
    shooterPosition: Vector;
  }) => {
    const systems = target.systems.getSystemsForHit(shooterPosition, null);
    return systems.find((system) => system instanceof Reactor) || null;
  };

  getArmorPiercing() {
    return 1000;
  }
}

export default TestDamageStrategy;
