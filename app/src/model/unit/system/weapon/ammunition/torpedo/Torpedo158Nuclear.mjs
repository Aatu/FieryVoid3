import Torpedo158 from "./Torpedo158.mjs";

class Torpedo158Nuclear extends Torpedo158 {
  constructor(args) {
    super(args, []);
  }

  getDisplayName() {
    return "Bodkin 1.53m nuclear torpedo";
  }

  getBackgroundImage() {
    return "/img/system/torpedoNuclear.png";
  }
}

export default Torpedo158Nuclear;
