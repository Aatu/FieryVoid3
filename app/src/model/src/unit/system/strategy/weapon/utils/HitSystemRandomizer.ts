import ShipSystem from "../../../ShipSystem";
import { SYSTEM_HANDLERS } from "../../types/SystemHandlersTypes";

class HitSystemRandomizer {
  rollForSystem(totalStructure: number) {
    return Math.ceil(Math.random() * totalStructure);
  }

  randomizeHitSystem(systems: ShipSystem[]) {
    if (systems.length === 0) {
      return null;
    }

    const totalStructure = systems.reduce(
      (total, system) => total + this.getSystemHitSize(system),
      0
    );

    const roll = this.rollForSystem(totalStructure);

    let tested = 0;

    return systems.find((system) => {
      if (roll > tested && roll <= this.getSystemHitSize(system) + tested) {
        return true;
      }

      tested += this.getSystemHitSize(system);
      return false;
    });
  }

  getSystemHitSize(system: ShipSystem) {
    return (
      system.hitpoints *
      system.callHandler(SYSTEM_HANDLERS.getHitSystemSizeMultiplier, null, 1)
    );
  }
}

export default HitSystemRandomizer;
