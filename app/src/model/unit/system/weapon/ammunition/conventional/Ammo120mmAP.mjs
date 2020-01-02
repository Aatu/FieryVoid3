import CargoEntity from "../../../cargo/CargoEntity.mjs";

class Ammo120mmAP extends CargoEntity {
  getDisplayName() {
    return "120mm armor piercing railgun projectile";
  }

  getShortDisplayName() {
    return "120mm AP";
  }

  getBackgroundImage() {
    return "/img/ammo/120mmAP.png";
  }
}

export default Ammo120mmAP;
