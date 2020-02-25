import Torpedo from "./Torpedo.mjs";

class Torpedo72 extends Torpedo {
  constructor({ minRange = 170, maxRange = 380, hitSize = 0, evasion = 50 }) {
    super({
      minRange,
      maxRange,
      hitSize,
      evasion
    });
  }
}

export default Torpedo72;
