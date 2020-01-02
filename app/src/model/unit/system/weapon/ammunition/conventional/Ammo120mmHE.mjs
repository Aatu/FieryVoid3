import CargoEntity from "../../../cargo/CargoEntity.mjs";

class Ammo120mmHE extends CargoEntity {
  getDisplayName() {
    return "120mm high explosive railgun projectile";
  }

  getShortDisplayName() {
    return "120mm HE";
  }

  getBackgroundImage() {
    return "/img/ammo/120mmHE.png";
  }
}

export default Ammo120mmHE;
