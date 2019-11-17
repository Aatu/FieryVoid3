import Torpedo158 from "./Torpedo158.mjs";

class Torpedo158MSV extends Torpedo158 {
  constructor(args) {
    super(args, []);
  }

  getDisplayName() {
    return "Shrike 1.53m MSV torpedo";
  }

  getBackgroundImage() {
    return "/img/system/torpedoMSV.png";
  }
}

export default Torpedo158MSV;
