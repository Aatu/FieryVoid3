import CargoEntity from "../../../cargo/CargoEntity.mjs";

class Ammo85mmAP extends CargoEntity {
  getDisplayName() {
    return "85mm armor piercing shell";
  }

  getShortDisplayName() {
    return "85mm AP";
  }

  getBackgroundImage() {
    return "/img/ammo/85mmAP.png";
  }
}

export default Ammo85mmAP;
