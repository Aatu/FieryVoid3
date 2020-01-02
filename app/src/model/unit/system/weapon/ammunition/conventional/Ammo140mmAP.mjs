import CargoEntity from "../../../cargo/CargoEntity.mjs";

class Ammo140mmAP extends CargoEntity {
  getDisplayName() {
    return "140mm armor piercing railgun projectile";
  }

  getShortDisplayName() {
    return "140mm AP";
  }

  getBackgroundImage() {
    return "/img/ammo/140mmAP.png";
  }
}

export default Ammo140mmAP;
