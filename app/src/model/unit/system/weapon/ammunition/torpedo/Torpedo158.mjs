import CargoEntity from "../../../cargo/CargoEntity.mjs";

class Torpedo158 extends CargoEntity {
  constructor({ deltaVelocityPerTurn, turnsToLive }) {
    super();
    this.deltaVelocityPerTurn = deltaVelocityPerTurn;
    this.turnsToLive = turnsToLive;
  }

  getCargoInfo() {
    const previousResponse = super.getCargoInfo();

    return [
      ...previousResponse,
      { header: "Velocity per turn", value: this.deltaVelocityPerTurn },
      { header: "Turns active", value: this.turnsToLive }
    ];
  }
}

export default Torpedo158;
