import CargoEntity from "../../cargo/CargoEntity.mjs";

class NoAmmunitionLoaded extends CargoEntity {
  getDisplayName() {
    return "NO AMMUNITION LOADED";
  }

  getBackgroundImage() {
    return "/img/system/noAmmo.png";
  }
}

export default NoAmmunitionLoaded;
