import MSVTorpedoDamageStrategy from "./torpedoDamageStrategy/MSVTorpedoDamageStrategy";
import Torpedo72 from "./Torpedo72";
import TorpedoFlight from "../../../../TorpedoFlight";
import Ship from "../../../../Ship";

class Torpedo72MSV extends Torpedo72 {
  constructor() {
    super({});

    this.damageStrategy = new MSVTorpedoDamageStrategy("d3+3", 0, 15, 25);
    this.visuals = {
      engineColor: [255 / 255, 222 / 255, 120 / 255],
      explosionType: "MSV",
      explosionSize: 0.5,
    };
  }

  getStrikeDistance(flight: TorpedoFlight, target: Ship) {
    return this.getDamageStrategy().getStrikeDistance({
      target,
      torpedoFlight: flight,
    });
  }

  getCargoInfo() {
    const previousResponse = super.getCargoInfo();

    return [
      {
        value: "A medium range torpedo with multiple strike vehicles.",
      },
      ...previousResponse,
    ];
  }

  getDisplayName() {
    return "Avalanche 0.72m MSV torpedo";
  }

  getBackgroundImage() {
    return "/img/system/torpedoMSVsmall.png";
  }
}

export default Torpedo72MSV;
