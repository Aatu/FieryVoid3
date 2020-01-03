import CargoEntity from "../../../cargo/CargoEntity.mjs";

class Ammo85mmHE extends CargoEntity {
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
}

export default Ammo85mmHE;
