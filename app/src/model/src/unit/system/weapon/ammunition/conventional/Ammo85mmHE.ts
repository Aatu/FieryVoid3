import Ammo from "../Ammo";

class Ammo85mmHE extends Ammo {
  constructor() {
    super({
      damageFormula: "2d4+2",
      armorPiercingFormula: 0,
      iterations: 1,
      overPenetrationDamageMultiplier: 0.5,
      damageArmorModifier: 2,
    });
  }

  getSpaceRequired() {
    return 0.02;
  }

  getDisplayName() {
    return "85mm high explosive shell";
  }

  getShortDisplayName() {
    return "85mm HE";
  }

  getBackgroundImage() {
    return "/img/ammo/85mmHE.png";
  }

  getIconText() {
    return "HE";
  }
}

export default Ammo85mmHE;
