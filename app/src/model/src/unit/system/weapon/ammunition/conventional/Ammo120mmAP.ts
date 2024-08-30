import Ammo from "../Ammo";

class Ammo120mmAP extends Ammo {
  constructor() {
    super({
      damageFormula: "2d3+5",
      armorPiercingFormula: 10,
      iterations: 1,
      overPenetrationDamageMultiplier: 0.5,
      damageArmorModifier: 1.5,
    });
  }

  getDisplayName() {
    return "120mm armor piercing railgun projectile";
  }

  getShortDisplayName() {
    return "120mm AP";
  }

  getBackgroundImage() {
    return "/img/ammo/120mmAP.png";
  }

  getIconText() {
    return "AP";
  }
}

export default Ammo120mmAP;
