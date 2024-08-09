import StandardDamageStrategy, {
  DamagePayload,
  ChooseHitSystemFunction,
  StandardDamagePayload,
} from "./StandardDamageStrategy";
import Structure from "../../structure/Structure";
import { SystemMessage } from "../types/SystemHandlersTypes";
import Ship from "../../../Ship.js";
import Vector from "../../../../utils/Vector";
import ShipSystem from "../../ShipSystem.js";
import SystemSection from "../../systemSection/SystemSection";
import CombatLogDamageEntry from "../../../../combatLog/CombatLogDamageEntry";

class PiercingDamageStrategy extends StandardDamageStrategy {
  constructor(
    damageFormula: string | number,
    armorPiercingFormula: string | number
  ) {
    super(damageFormula, armorPiercingFormula);
  }

  getDamageTypeMessage() {
    return "Piercing";
  }

  getMessages(
    payload: unknown,
    previousResponse: SystemMessage[] = []
  ): SystemMessage[] {
    previousResponse.push({
      header: "Damage type",
      value: this.getDamageTypeMessage(),
    });

    previousResponse.push({
      value:
        "Piercing will cause damage multiple times applying new damage each time, until it runs out of armor piercing." +
        " Piercing will not damage other than structures multiple times.",
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

  protected chooseHitSystem: ChooseHitSystemFunction<{
    systemsHit: ShipSystem[];
  }> = ({ target, shooterPosition, systemsHit }) => {
    const systems = target.systems
      .getSystemsForHit(shooterPosition, null)
      .filter((system) => !systemsHit.some((hit) => system.id === hit.id));
    return this.hitSystemRandomizer.randomizeHitSystem(systems) || null;
  };

  protected doDamage(
    payload: StandardDamagePayload & { shooterPosition: Vector },
    damageResult: CombatLogDamageEntry,
    lastSection: SystemSection | null,
    armorPiercing: number = 0,
    inputDamage?: number,
    shotsResolved: number = 0,
    systemsHit: ShipSystem[] = []
  ): void {
    const { target, shooterPosition, combatLogEntry } = payload;

    if (armorPiercing === 0) {
      combatLogEntry.addNote(
        `Pierced ${shotsResolved} times. Ran out of armor piercing.`
      );
      return;
    }

    if (armorPiercing === undefined) {
      armorPiercing = this.getArmorPiercing(payload);
    }

    const hitSystem = this.chooseHitSystem({
      target,
      shooterPosition,
      systemsHit,
      lastSection: null,
    });

    if (!hitSystem) {
      return;
    }

    let result = this.doDamageToSystem(
      payload,
      damageResult,
      hitSystem,
      armorPiercing,
      this.getDamageForWeaponHit(payload)
    );

    armorPiercing = result.armorPiercing;

    if (!(hitSystem instanceof Structure)) {
      systemsHit.push(hitSystem);
    }

    return this.doDamage(
      payload,
      damageResult,
      null,
      armorPiercing,
      0,
      shotsResolved + 1,
      systemsHit
    );
  }
}

export default PiercingDamageStrategy;
