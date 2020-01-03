import CargoEntity from "../../../cargo/CargoEntity.mjs";

class Ammo30mm extends CargoEntity {
  getSpaceRequired() {
    return 0.01;
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
