import Torpedo from "./Torpedo.mjs";

class Torpedo158 extends Torpedo {
  constructor({ minRange = 220, maxRange = 400, hitSize = 0, evasion = 30 }) {
    super({
      minRange,
      maxRange,
      hitSize,
      evasion
    });
  }
}

export default Torpedo158;
