import Ship from "../../Ship.mjs";
import systems from "../../system";

class UcRhino extends Ship {
  constructor(data) {
    super(data);

    this.shipTypeName = 'Conley Shipyards RX11 "Rhino"';
    this.shipModel = this.accelcost = 3;
    this.rollcost = 3;
    this.pivotcost = 3;
    this.evasioncost = 3;

    this.shipModel = "Rhino";
    this.pointCost = 500;

    this.systems.addFrontSystem([
      new systems.ManeuveringThruster(
        { id: 101, hitpoints: 10, armor: 3 },
        3,
        2
      )
    ]);

    this.systems.addPrimarySystem([
      new systems.Thruster({ id: 1, hitpoints: 10, armor: 3 }, 5, 0),
      new systems.Thruster({ id: 2, hitpoints: 10, armor: 3 }, 5, 0),
      new systems.Thruster({ id: 8, hitpoints: 10, armor: 3 }, 5, [1, 2]),
      new systems.Thruster({ id: 9, hitpoints: 10, armor: 3 }, 5, [4, 5]),
      new systems.Thruster({ id: 3, hitpoints: 10, armor: 3 }, 5, 3),
      new systems.Thruster({ id: 4, hitpoints: 10, armor: 3 }, 5, 3),

      new systems.Engine({ id: 5, hitpoints: 10, armor: 3 }, 12, 6, 2),
      new systems.Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
      new systems.Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
      new systems.Structure({ id: 11, hitpoints: 30, armor: 4 })
    ]);

    this.systems.addAftSystem([
      new systems.ManeuveringThruster(
        { id: 201, hitpoints: 10, armor: 3 },
        3,
        2
      )
    ]);
  }
}

export default UcRhino;
