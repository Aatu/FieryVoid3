import CargoEntity from "../../../cargo/CargoEntity.mjs";

class Ammo140mmHE extends CargoEntity {
  getDisplayName() {
    return "140mm high explosive railgun projectile";
  }

  getShortDisplayName() {
    return "140mm HE";
  }

  getBackgroundImage() {
    return "/img/ammo/140mmHE.png";
  }
}

export default Ammo140mmHE;
