import Torpedo158 from "./Torpedo158.mjs";

class Torpedo158MSV extends Torpedo158 {
  constructor() {
    super({ deltaVelocityPerTurn: 48, turnsToLive: 6 });
  }

  getCargoInfo() {
    const previousResponse = super.getCargoInfo();

    return [
      {
        value: "A long range torpedo with Multiple Strike Vehicles."
      },
      ...previousResponse
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
