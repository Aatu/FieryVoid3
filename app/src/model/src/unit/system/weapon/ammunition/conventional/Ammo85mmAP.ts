import Ammo from "../Ammo";

class Ammo85mmAP extends Ammo {
  constructor() {
    super({
      damageFormula: "d3",
      armorPiercingFormula: "2d3+2",
      iterations: 1,
      overPenetrationDamageMultiplier: 0.5,
      damageArmorModifier: 2,
    });
  }

  getSpaceRequired() {
    return 0.02;
  }

  getDisplayName() {
    return "85mm armor piercing shell";
  }

  getShortDisplayName() {
    return "85mm AP";
  }

  getBackgroundImage() {
    return "/img/ammo/85mmAP.png";
  }

  getIconText() {
    return "AP";
  }
}

export default Ammo85mmAP;
