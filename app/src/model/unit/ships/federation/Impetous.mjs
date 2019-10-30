import Ship from "../../Ship.mjs";
import systems from "../../system/index.mjs";
import Offset from "../../../hexagon/Offset.mjs";

class Impetous extends Ship {
  setShipProperties() {
    this.shipTypeName = "Impetous";
    this.shipModel = this.accelcost = 3;
    this.rollcost = 3;
    this.pivotcost = 3;
    this.evasioncost = 3;
    this.hexSizes = [new Offset(0, 0), new Offset(-1, 0), new Offset(1, 0)];

    this.description = ``;

    this.shipModel = "Impetous";
    this.pointCost = 500;

    this.systems.addFrontSystem([
      new systems.ManeuveringThruster({ id: 1, hitpoints: 10, armor: 3 }, 3, 2)
    ]);

    this.systems.addPrimarySystem([
      new systems.Thruster({ id: 601, hitpoints: 10, armor: 3 }, 5, 0),
      new systems.Thruster({ id: 602, hitpoints: 10, armor: 3 }, 5, 0),
      new systems.Thruster({ id: 608, hitpoints: 10, armor: 3 }, 5, [1, 2]),
      new systems.Thruster({ id: 609, hitpoints: 10, armor: 3 }, 5, [4, 5]),
      new systems.Thruster({ id: 603, hitpoints: 10, armor: 3 }, 5, 3),
      new systems.Thruster({ id: 604, hitpoints: 10, armor: 3 }, 5, 3),

      new systems.EwArray({ id: 612, hitpoints: 30, armor: 4 }, 8),

      new systems.Engine({ id: 605, hitpoints: 10, armor: 3 }, 12, 6, 2),
      new systems.Engine({ id: 606, hitpoints: 10, armor: 3 }, 12, 6, 2),
      new systems.Reactor({ id: 607, hitpoints: 10, armor: 3 }, 20),
      new systems.Structure({ id: 611, hitpoints: 30, armor: 4 })
    ]);

    this.systems.addAftSystem([
      new systems.ManeuveringThruster(
        { id: 201, hitpoints: 10, armor: 3 },
        3,
        2
      )
    ]);

    this.systems.addStarboardFrontSystem([
      new systems.PDC30mm(
        { id: 101, hitpoints: 5, armor: 3 },
        { start: 0, end: 180 }
      ),
      new systems.PDC30mm(
        { id: 102, hitpoints: 5, armor: 3 },
        { start: 0, end: 180 }
      ),
      new systems.PDC30mm(
        { id: 103, hitpoints: 5, armor: 3 },
        { start: 0, end: 180 }
      )
    ]);

    this.systems.addPortFrontSystem([
      new systems.PDC30mm(
        { id: 501, hitpoints: 5, armor: 3 },
        { start: 180, end: 0 }
      ),
      new systems.PDC30mm(
        { id: 502, hitpoints: 5, armor: 3 },
        { start: 180, end: 0 }
      ),
      new systems.PDC30mm(
        { id: 503, hitpoints: 5, armor: 3 },
        { start: 180, end: 0 }
      )
    ]);
  }
}

export default Impetous;
