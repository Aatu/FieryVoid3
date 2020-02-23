import CargoEntity from "../../../cargo/CargoEntity.mjs";

class Torpedo extends CargoEntity {
  constructor({ minRange = 100, maxRange = 300, hitSize = 0, evasion = 30 }) {
    super();
    this.minRange = minRange;
    this.maxRange = maxRange;
    this.hitSize = hitSize;
    this.evasion = evasion;

    this.damageStrategy = null;

    this.visuals = {
      engineColor: [51 / 255, 163 / 255, 255 / 255],
      explosionType: "HE",
      explosionSize: 15
    };
  }

  getStrikeDistance(flight, target) {
    return 1;
  }

  getHitSize() {
    return this.hitSize;
  }

  getEvasion() {
    return this.evasion;
  }

  getInterceptTries(target) {
    return [1, 2, 3];
  }

  getCargoInfo() {
    const previousResponse = super.getCargoInfo();

    return [
      ...previousResponse,
      { header: "Range", value: `${this.minRange} – ${this.maxRange} hexes` },
      { header: "Evasion", value: `+${this.evasion * 10}% range penalty` },
      ...this.damageStrategy.getMessages()
    ];
  }
}

export default Torpedo;
