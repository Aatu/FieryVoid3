import Ship from "../../Ship.mjs";
import systems from "../../system/index.mjs";
import Offset from "../../../hexagon/Offset.mjs";
import { RailgunTurreted32gw } from "../../system/weapon/railgun/index.mjs";

class Mouros extends Ship {
  setShipProperties() {
    this.shipTypeName =
      "OuterLight Industries Mouros 118-A mainstay battleship";
    this.shipModel = this.accelcost = 3;
    this.rollcost = 3;
    this.pivotcost = 3;
    this.evasioncost = 3;
    this.hexSizes = [new Offset(0, 0), new Offset(-1, 0), new Offset(1, 0)];

    this.description = ``;

    this.shipModel = "Mouros";
    this.pointCost = 500;

    this.systems.addFrontSystem([
      new systems.ManeuveringThruster(
        { id: 101, hitpoints: 10, armor: 3 },
        3,
        2
      ),

      new systems.Structure({ id: 102, hitpoints: 40, armor: 6 })
    ]);

    this.systems.addPrimarySystem([
      new systems.Thruster({ id: 1, hitpoints: 10, armor: 3 }, 5, 0),
      new systems.Thruster({ id: 2, hitpoints: 10, armor: 3 }, 5, 0),

      new systems.EwArray({ id: 12, hitpoints: 30, armor: 4 }, 8),

      new systems.Engine({ id: 5, hitpoints: 10, armor: 7 }, 10, 6, 2),
      new systems.Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
      new systems.Structure({ id: 11, hitpoints: 50, armor: 5 })
    ]);

    this.systems.addAftSystem([
      new systems.ManeuveringThruster(
        { id: 201, hitpoints: 10, armor: 3 },
        3,
        2
      ),

      new systems.Engine({ id: 206, hitpoints: 20, armor: 7 }, 15, 6, 2),
      new systems.Thruster({ id: 203, hitpoints: 10, armor: 3 }, 5, 3),
      new systems.Thruster({ id: 204, hitpoints: 10, armor: 3 }, 5, 3),
      new systems.Structure({ id: 202, hitpoints: 80, armor: 4 })
    ]);

    this.systems.addStarboardAftSystem([
      new RailgunTurreted32gw(
        { id: 301, hitpoints: 10, armor: 3 },
        { start: 0, end: 183 }
      ),

      new systems.Thruster({ id: 308, hitpoints: 10, armor: 3 }, 5, [1, 2])
    ]);

    this.systems.addPortAftSystem([
      new RailgunTurreted32gw(
        { id: 501, hitpoints: 10, armor: 3 },
        { start: 177, end: 0 }
      ),

      new systems.Thruster({ id: 508, hitpoints: 10, armor: 3 }, 5, [4, 5])
    ]);
  }
}

export default Mouros;
