import Ship from "../../Ship.mjs";
import systems from "../../system/index.mjs";

class Caliope extends Ship {
  setShipProperties() {
    this.shipTypeName = "OuterLight Industries Caliope OI-E1 cruiser";
    this.shipModel = this.accelcost = 3;
    this.rollcost = 3;
    this.pivotcost = 3;
    this.evasioncost = 3;

    this.description = `
        Caliope cruiser was initially conceived with grandiose goals of including
        battleship capabilities on cruiser tonnage class spaceframe. 

        First two Caliope A1 prototypes built by Patria Space were equipped with three Silverbreak 12 fusion engines,
        two kinetic batteries, two light PDCs, three medium PDCs, two Hayfire 45MW railgun turrets and
        eight 1.2m and two 3.5m missile tubes.  The spaceframes were built around and powered by 
        two Langban-Zukov class III fusion generators.

        On field testing the new ships failed to meet the required specifications. The spaceframe turned out unable to
        provide stable enough firing platform for the railgun turrets causing buildup of micro fractures
        and resulting in subpar accuracy and reliability for the guns. Caliope was also found under armored for
        fighting in the battleship class. 

        One of the prototypes where modified to Caliope A2 by substituting the railgun turrets with fixed mount railguns. 
        Filed testing of Caliope A2 showed the ship too unmanouverable to use the fixed railguns efficiently and this 
        modification failed to save the design.

        Caliope project was abandoned as a failure, but subsequently aquired by OuterLight Industries when Patria Space 
        ran into finiancial difficulties. An experienced ship designed Markov Mohammed saw promise in the Caliope. 

        Caliope was repurposed to a long range cruiser by removing the railgun turrets. Freed space was used for extra
        crew quarters, cargo and fuel space. The armor of the ship was reduced to gain much needed manouverability and
        bring the spaceframe to safe structural stress levels. Abandoning the railguns left the ship with considerable
        surplus of energy production and heat management capacity. This allowed the upgrade of the engines to more
        powerful Silverbreak 15R model. Armament wise the new Caliope OI-B1 was equiped with four Maltech 210mm Twin kinetic
        cannon turrets and seven 20mm Maltech PDCs. The missile launchers and magazines were left untouched.

        These changes resulted in a ship considerably different from the initial design goals. First four Caliope OL-B3 cruisers
        delivered to the Protectorate found great success in counter piracy role. Even tough Caliope is considered underarmored and
        less than ideally manouverable for a mainstay cruiser, it can operate extended durations without resupply and it has an excellent
        acceleration and heat management for extended chases. Perfect for running down pirates. Caliopes missile capabilities has
        found use in fleet action as a missile picket ship. Caliopes engage in missile barrages but avoid close fighting. If 
        fleets close in, Caliopes are kept in reserve to chase down and finish damaged enemy vessels. Caliopes are also 
        suited to supplying smaller ships, altough more specialized ships can perform this role better.
    `;

    this.shipModel = "Caliope";
    this.pointCost = 500;

    this.systems.addFrontSystem([
      new systems.ManeuveringThruster(
        { id: 101, hitpoints: 10, armor: 3 },
        3,
        2
      ),
      new systems.Thruster({ id: 103, hitpoints: 10, armor: 3 }, 5, 3),
      new systems.Thruster({ id: 104, hitpoints: 10, armor: 3 }, 5, 3),
      new systems.Structure({ id: 111, hitpoints: 30, armor: 4 })
    ]);

    this.systems.addPrimarySystem([
      new systems.Engine({ id: 6, hitpoints: 20, armor: 3 }, 12, 6, 2),
      new systems.Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
      new systems.Structure({ id: 11, hitpoints: 30, armor: 4 }),
      new systems.EwArray({ id: 12, hitpoints: 30, armor: 4 }, 8),
      new systems.HeatSink({ id: 13, hitpoints: 10, armor: 3 }),
      new systems.HeatSink({ id: 14, hitpoints: 10, armor: 3 })
    ]);

    this.systems.addStarboardFrontSystem([
      new systems.Thruster({ id: 8, hitpoints: 10, armor: 3 }, 5, [1, 2])
    ]);

    this.systems.addPortFrontSystem([
      new systems.Thruster({ id: 9, hitpoints: 10, armor: 3 }, 5, [4, 5])
    ]);

    this.systems.addAftSystem([
      new systems.ManeuveringThruster(
        { id: 301, hitpoints: 10, armor: 3 },
        3,
        2
      ),

      new systems.Thruster({ id: 31, hitpoints: 10, armor: 3 }, 5, 0),
      new systems.Thruster({ id: 32, hitpoints: 10, armor: 3 }, 5, 0),
      new systems.Thruster({ id: 33, hitpoints: 10, armor: 3 }, 5, 0),

      new systems.Structure({ id: 311, hitpoints: 30, armor: 4 }),
      new systems.HeatSink({ id: 313, hitpoints: 10, armor: 3 }),
      new systems.HeatSink({ id: 314, hitpoints: 10, armor: 3 }),
      new systems.Radiator({ id: 312, hitpoints: 10, armor: 3 })
    ]);

    this.systems.addPortAftSystem([
      new systems.Radiator({ id: 401, hitpoints: 10, armor: 3 })
    ]);

    this.systems.addStarboardAftSystem([
      new systems.Radiator({ id: 201, hitpoints: 10, armor: 3 })
    ]);
  }
}

export default Caliope;
