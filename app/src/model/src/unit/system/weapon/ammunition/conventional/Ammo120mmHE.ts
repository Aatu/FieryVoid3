import Ammo from "../Ammo";

class Ammo120mmHE extends Ammo {
  constructor() {
    super({
      damageFormula: "2d4 + 10",
      armorPiercingFormula: 0,
      iterations: 1,
      overPenetrationDamageMultiplier: 0.5,
      damageArmorModifier: 1.5,
    });
  }

  getDisplayName() {
    return "120mm high explosive railgun projectile";
  }

  getShortDisplayName() {
    return "120mm HE";
  }

  getBackgroundImage() {
    return "/img/ammo/120mmHE.png";
  }

  getIconText() {
    return "HE";
  }
}

export default Ammo120mmHE;
