import Ammo from "../Ammo";

class Ammo30mm extends Ammo {
  constructor() {
    super({
      damageFormula: "d2",
      armorPiercingFormula: "d3+2",
      iterations: 1,
      overPenetrationDamageMultiplier: 0.5,
      damageArmorModifier: 2,
    });
  }

  getSpaceRequired() {
    return 0.1;
  }

  getDisplayName() {
    return "30mm PDC shell";
  }

  getShortDisplayName() {
    return "30mm";
  }

  getBackgroundImage() {
    return "/img/ammo/30mm.png";
  }
}

export default Ammo30mm;
