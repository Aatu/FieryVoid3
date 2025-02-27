import Ship from "../../../../Ship";
import TorpedoFlight from "../../../../TorpedoFlight";
import Torpedo158 from "./Torpedo158";
import TorpedoDamageStrategy from "./torpedoDamageStrategy/TorpedoDamageStrategy";

class Torpedo158MSV extends Torpedo158 {
  constructor() {
    super({});
    this.damageStrategy = new TorpedoDamageStrategy(
      {
        armorPiercingFormula: 0,
        damageFormula: "d3+3",
      },
      {
        msvAmount: 32,
        msvRangePenalty: 10,
        msvHitBonus: 20,
        msvEvasionModifier: 0.5,
        msvStrikeHitChanceTarget: 20,
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
        value: "A long range torpedo with Multiple Strike Vehicles.",
      },
      ...previousResponse,
    ];
  }

  getDisplayName() {
    return "Shrike 1.53m MSV torpedo";
  }

  getBackgroundImage() {
    return "/img/system/torpedoMSV.png";
  }
}

export default Torpedo158MSV;
