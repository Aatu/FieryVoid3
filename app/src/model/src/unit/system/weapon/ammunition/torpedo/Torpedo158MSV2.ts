import Ship from "../../../../Ship";
import TorpedoFlight from "../../../../TorpedoFlight";
import Torpedo158 from "./Torpedo158";
import TorpedoDamageStrategy from "./torpedoDamageStrategy/TorpedoDamageStrategy";

class Torpedo158MSV2 extends Torpedo158 {
  constructor() {
    super({ evasion: 35 });

    this.damageStrategy = new TorpedoDamageStrategy(
      {
        armorPiercingFormula: 0,
        damageFormula: "d3",
      },
      {
        msvAmount: 84,
        msvRangePenalty: 5,
        msvStrikeHitChanceTarget: 10,
      }
    );

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
        value:
          "A long range torpedo with Multiple Strike Vehicles. Designed to supress smaller targets.",
      },
      ...previousResponse,
    ];
  }

  getDisplayName() {
    return "Shrike B 1.53m saturation MSV torpedo";
  }

  getBackgroundImage() {
    return "/img/system/torpedoMSV2.png";
  }
}

export default Torpedo158MSV2;
