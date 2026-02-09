import { MEDIUM_WEAPON_RANGE } from "../../../../../config/gameConfig";
import Torpedo from "./Torpedo";
class Torpedo158 extends Torpedo {
  constructor({
    minRange = MEDIUM_WEAPON_RANGE * 2,
    maxRange = Math.round(MEDIUM_WEAPON_RANGE * 4.5),
    hitSize = 0,
    evasion = 30,
  }) {
    super({
      minRange,
      maxRange,
      hitSize,
      evasion,
    });
  }
}

export default Torpedo158;
