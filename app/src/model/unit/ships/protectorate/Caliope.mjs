import Ship from "../../Ship.mjs";
import systems from "../../system/index.mjs";
import Offset from "../../../hexagon/Offset.mjs";
import Torpedo72MSV from "../../system/weapon/ammunition/torpedo/Torpedo72MSV.mjs";
import Torpedo158MSV from "../../system/weapon/ammunition/torpedo/Torpedo158MSV.mjs";
import Torpedo158Nuclear from "../../system/weapon/ammunition/torpedo/Torpedo158Nuclear.mjs";
import Ammo140mmAP from "../../system/weapon/ammunition/conventional/Ammo140mmAP.mjs";
import Ammo120mmAP from "../../system/weapon/ammunition/conventional/Ammo120mmAP.mjs";
import Ammo140mmHE from "../../system/weapon/ammunition/conventional/Ammo140mmHE.mjs";
import Ammo85mmAP from "../../system/weapon/ammunition/conventional/Ammo85mmAP.mjs";
import Ammo85mmHE from "../../system/weapon/ammunition/conventional/Ammo85mmHE.mjs";
import CargoService from "../../../cargo/CargoService.mjs";
import Ammo30mm from "../../system/weapon/ammunition/conventional/Ammo30mm.mjs";
import Torpedo72HE from "../../system/weapon/ammunition/torpedo/Torpedo72HE.mjs";

class Caliope extends Ship {
  setShipProperties() {
    this.shipTypeName = "OuterLight Industries Caliope OI-E1 cruiser";
    this.hexSizes = [
      new Offset(2, 0),
      new Offset(1, 0),
      new Offset(0, 0),
      new Offset(-1, 0),
    ];
    this.accelcost = 3;
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
      new systems.ChemicalThruster({ id: 103, hitpoints: 10, armor: 3 }, 5, 0),
      new systems.PDC30mm(
        { id: 114, hitpoints: 5, armor: 3 },
        { start: 200, end: 160 }
      ),

      new systems.PDC30mm(
        { id: 115, hitpoints: 5, armor: 3 },
        { start: 200, end: 160 }
      ),
      new systems.ChemicalThruster({ id: 104, hitpoints: 10, armor: 3 }, 5, 0),
      new systems.Structure({
        id: 111,
        hitpoints: 40,
        armor: 5,
        heatStorage: 20,
        radiator: 3,
      }),

      new systems.ManeuveringThruster(
        { id: 101, hitpoints: 10, armor: 3 },
        3,
        2
      ),
    ]);

    this.systems.addPrimarySystem([
      new systems.Reactor({ id: 7, hitpoints: 10, armor: 8 }, 20),
      new systems.Structure({
        id: 11,
        hitpoints: 60,
        armor: 4,
        cargoSpace: 300,
        heatStorage: 80,
        radiator: 15,
      }),
      new systems.EwArray({ id: 12, hitpoints: 15, armor: 6 }, 8),
      new systems.HeatSink({ id: 13, hitpoints: 10, armor: 3 }, 100),
    ]);

    this.systems.addStarboardFrontSystem([
      new systems.ChemicalThruster({ id: 201, hitpoints: 10, armor: 3 }, 5, [
        1,
        2,
      ]),

      new systems.RailgunTurreted2x140mm(
        { id: 213, hitpoints: 8, armor: 4 },
        { start: 330, end: 90 }
      ),
      new systems.PDC30mm(
        { id: 202, hitpoints: 4, armor: 3 },
        { start: 0, end: 180 }
      ),
      new systems.AutoCannon85mm(
        { id: 203, hitpoints: 6, armor: 3 },
        { start: 330, end: 160 }
      ),
      new systems.AutoCannon85mm(
        { id: 204, hitpoints: 6, armor: 3 },
        { start: 330, end: 160 }
      ),
    ]);

    this.systems.addPortFrontSystem([
      new systems.RailgunTurreted2x140mm(
        { id: 612, hitpoints: 8, armor: 4 },
        { start: 270, end: 30 }
      ),
      new systems.ChemicalThruster({ id: 601, hitpoints: 10, armor: 3 }, 5, [
        4,
        5,
      ]),

      new systems.AutoCannon85mm(
        { id: 603, hitpoints: 6, armor: 3 },
        { start: 200, end: 30 }
      ),
      new systems.PDC30mm(
        { id: 602, hitpoints: 4, armor: 3 },
        { start: 180, end: 0 }
      ),
      new systems.AutoCannon85mm(
        { id: 604, hitpoints: 6, armor: 3 },
        { start: 200, end: 30 }
      ),
    ]);

    this.systems.addAftSystem([
      new systems.ManeuveringThruster(
        { id: 401, hitpoints: 10, armor: 3 },
        3,
        2
      ),

      new systems.Thruster({ id: 431, hitpoints: 15, armor: 3 }, 8, 3),
      new systems.Thruster({ id: 432, hitpoints: 15, armor: 3 }, 8, 3),
      new systems.Thruster({ id: 433, hitpoints: 15, armor: 3 }, 8, 3),

      new systems.Structure({
        id: 411,
        hitpoints: 80,
        armor: 4,
        heatStorage: 100,
        radiator: 5,
      }),
      new systems.Radiator10x40({ id: 412, hitpoints: 10, armor: 3 }),
      new systems.Reactor({ id: 407, hitpoints: 10, armor: 3 }, 30),
      new systems.AutoCannon85mm(
        { id: 421, hitpoints: 6, armor: 3 },
        { start: 0, end: 0 }
      ),
    ]);

    this.systems.addPortAftSystem([
      new systems.Radiator10x40({ id: 501 }),
      new systems.CargoBay({ id: 502, hitpoints: 20, armor: 4 }, 150),
      new systems.TorpedoLauncher158({ id: 503, hitpoints: 10, armor: 4 }),
      new systems.TorpedoLauncherDual72({ id: 504, hitpoints: 10, armor: 4 }),
      new systems.AutoCannon85mm(
        { id: 521, hitpoints: 6, armor: 3 },
        { start: 160, end: 30 }
      ),
    ]);

    this.systems.addStarboardAftSystem([
      new systems.Radiator10x40({ id: 301 }),
      new systems.CargoBay({ id: 302, hitpoints: 20, armor: 4 }, 150),
      new systems.TorpedoLauncher158({ id: 303, hitpoints: 10, armor: 4 }),
      new systems.TorpedoLauncherDual72({ id: 304, hitpoints: 10, armor: 4 }),
      new systems.AutoCannon85mm(
        { id: 321, hitpoints: 6, armor: 3 },
        { start: 330, end: 200 }
      ),
    ]);
  }

  setShipLoadout() {
    super.setShipLoadout();

    const cargoService = new CargoService();
    cargoService.divideCargo(this, {
      object: new Torpedo72MSV(),
      amount: 12,
    });

    cargoService.divideCargo(this, {
      object: new Torpedo72HE(),
      amount: 12,
    });

    cargoService.divideCargo(this, {
      object: new Torpedo158MSV(),
      amount: 12,
    });

    cargoService.divideCargo(this, {
      object: new Torpedo158Nuclear(),
      amount: 2,
    });

    cargoService.divideCargo(this, {
      object: new Ammo30mm(),
      amount: 800,
    });

    cargoService.divideCargo(this, {
      object: new Ammo140mmAP(),
      amount: 40,
    });

    cargoService.divideCargo(this, {
      object: new Ammo140mmHE(),
      amount: 80,
    });

    cargoService.divideCargo(this, {
      object: new Ammo85mmAP(),
      amount: 200,
    });

    cargoService.divideCargo(this, {
      object: new Ammo85mmHE(),
      amount: 400,
    });

    this.systems.getSystemById(303).callHandler("loadAmmoInstant", {
      ammo: new Torpedo158MSV(),
      launcherIndex: 1,
    });
    this.systems.getSystemById(503).callHandler("loadAmmoInstant", {
      ammo: new Torpedo158MSV(),
      launcherIndex: 1,
    });

    this.systems.getSystemById(304).callHandler("loadAmmoInstant", {
      ammo: new Torpedo72MSV(),
      launcherIndex: 1,
    });
    this.systems.getSystemById(304).callHandler("loadAmmoInstant", {
      ammo: new Torpedo72HE(),
      launcherIndex: 2,
    });

    this.systems.getSystemById(504).callHandler("loadAmmoInstant", {
      ammo: new Torpedo72MSV(),
      launcherIndex: 1,
    });
    this.systems.getSystemById(504).callHandler("loadAmmoInstant", {
      ammo: new Torpedo72HE(),
      launcherIndex: 2,
    });
  }
}

export default Caliope;
