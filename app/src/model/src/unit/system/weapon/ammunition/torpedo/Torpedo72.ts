import { MEDIUM_WEAPON_RANGE } from "../../../../../config/gameConfig";
import Torpedo from "./Torpedo";

class Torpedo72 extends Torpedo {
  constructor({
    minRange = MEDIUM_WEAPON_RANGE * 2,
    maxRange = Math.round(MEDIUM_WEAPON_RANGE * 3.5),
    hitSize = 0,
    evasion = 50,
  }) {
    super({
      minRange,
      maxRange,
      hitSize,
      evasion,
    });
  }
}

export default Torpedo72;
