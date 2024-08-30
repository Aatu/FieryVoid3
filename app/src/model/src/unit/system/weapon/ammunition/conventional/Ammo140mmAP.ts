import Ammo from "../Ammo";

class Ammo140mmAP extends Ammo {
  constructor() {
    super({
      damageFormula: "2d3+6",
      armorPiercingFormula: 12,
      iterations: 1,
      overPenetrationDamageMultiplier: 0.5,
      damageArmorModifier: 1.5,
    });
  }

  getDisplayName() {
    return "140mm armor piercing railgun projectile";
  }

  getShortDisplayName() {
    return "140mm AP";
  }

  getBackgroundImage() {
    return "/img/ammo/140mmAP.png";
  }

  getIconText() {
    return "AP";
  }
}

export default Ammo140mmAP;
