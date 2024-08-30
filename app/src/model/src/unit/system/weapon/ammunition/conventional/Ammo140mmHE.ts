import Ammo from "../Ammo";

class Ammo140mmHE extends Ammo {
  constructor() {
    super({
      damageFormula: "2d5",
      armorPiercingFormula: 0,
      iterations: 1,
      overPenetrationDamageMultiplier: 0.5,
      damageArmorModifier: 1.5,
    });
  }

  getDisplayName() {
    return "140mm high explosive railgun projectile";
  }

  getShortDisplayName() {
    return "140mm HE";
  }

  getBackgroundImage() {
    return "/img/ammo/140mmHE.png";
  }

  getIconText() {
    return "HE";
  }
}

export default Ammo140mmHE;
