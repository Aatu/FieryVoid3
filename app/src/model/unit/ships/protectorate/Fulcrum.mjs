import Ship from "../../Ship.mjs";
import systems from "../../system/index.mjs";
import Offset from "../../../hexagon/Offset.mjs";
import Torpedo72MSV from "../../system/weapon/ammunition/torpedo/Torpedo72MSV.mjs";
import CargoService from "../../../cargo/CargoService.mjs";
import Ammo30mm from "../../system/weapon/ammunition/conventional/Ammo30mm.mjs";
import Ammo120mmAP from "../../system/weapon/ammunition/conventional/Ammo120mmAP.mjs";
import Ammo120mmHE from "../../system/weapon/ammunition/conventional/Ammo120mmHE.mjs";

class Fulcrum extends Ship {
  setShipProperties() {
    this.shipTypeName = "Arakaki Systems Fulcrum IV fleet destroyer";
    this.accelcost = 2;
    this.rollcost = 4;
    this.pivotcost = 2;
    this.evasioncost = 2;
    this.hexSizes = [new Offset(1, 0), new Offset(0, 0), new Offset(-1, 0)];

    this.description = `
       Fulcrum was ordered to fill the role of a fleet destroyer. A ship that packs enough of a punch in 
       sufficiently armored frame to engage in front line fleet combat. The design requirements allowed
       a considerable defieciency in endurance making the Fulcrum a ship that needs a supporting fleet
       to operate in a meaningful role on a modern battlefield. 

       Arakaki Systems won the contract with the Fulcrum design. Fulcrum sacrifices endurance, 
       heat management and some speed to bring on a battlefield a destroyed armed with a spinal
       mounted railgun, three kinetic cannons on a fixed bow mount, considerable six light PDCs 
       and a two missile launchers. All this in well armored spaceframe. 

       A squadron of Fulcrums can turn a battle if employed properly, but their role and 
       commitment must be well planned. A Fulcrum can function in a role of escort, rail gun attack craft
       or close attack craft, but lack the endurance and heat management to keep up sustained railgun fire
       or the manouvers needed in close quarters. This forces Fulcrums to disengage under fleet
       protection to extends radiators or in extreme cases to resupply fuel and ammunition.

       While the Fulcrum has a considerable PDC grid its missile capacity is greatly lacking for anything
       else than defense or employment against unarmed or disabled targets. Fulcrums are also considered
       undercrewed by many fleet standards. In combat operations the crew must work and live in cramped 
       conditions in extended shifts. Crew compliment does not include any marines, and the ship 
       deck plan is not optimized for repeling boarders, nor does it have any capacity for holding prisoners.

       Regardless of this long list of deficiencies, a Fulcrum can employ a combination of superior
       weaponry and manouverability to create an engagement where Fulcrum can effectively either 
       out range or out gun its opponent. In close quarter battle a Fulcrum can engage an opponent
       and with superior armor still disengage with neglible damage to critical systems.
    `;

    this.shipModel = "Fulcrum";
    this.pointCost = 500;

    this.systems.addFrontSystem([
      new systems.Structure({
        id: 100,
        hitpoints: 30,
        armor: 5,
        heatStorage: 30,
      }),

      new systems.CoilgunLightFixed({ id: 102 }, { start: 330, end: 30 }),
      new systems.RailgunFixed120mm({ id: 103 }, { start: 330, end: 30 }),
      new systems.RailgunFixed120mm({ id: 104 }, { start: 330, end: 30 }),
      new systems.RailgunFixed120mm({ id: 105 }, { start: 330, end: 30 }),

      new systems.ChemicalThruster({ id: 106, hitpoints: 10, armor: 3 }, 3, 0),
      new systems.ChemicalThruster({ id: 107, hitpoints: 10, armor: 3 }, 3, 0),
      new systems.ManeuveringThruster(
        { id: 101, hitpoints: 10, armor: 3 },
        10,
        2
      ),
      new systems.TorpedoLauncherDual72({ id: 108, hitpoints: 10, armor: 4 }),
    ]);

    this.systems.addPrimarySystem([
      new systems.EwArray(
        { id: 12, hitpoints: 12, armor: 6, boostPower: 5 },
        7
      ),

      new systems.Reactor({ id: 7, hitpoints: 15, armor: 7 }, 35),
      new systems.Structure({
        id: 11,
        hitpoints: 30,
        armor: 6,
        cargoSpace: 100,
        heatStorage: 70,
        radiator: 5,
      }),

      new systems.PDC30mm(
        { id: 14, alwaysTargetable: true },
        { start: 0, end: 0 }
      ),
    ]);

    this.systems.addAftSystem([
      new systems.Structure({
        id: 200,
        hitpoints: 40,
        armor: 6,
        heatStorage: 20,
        radiator: 10,
      }),

      new systems.ManeuveringThruster(
        { id: 201, hitpoints: 10, armor: 3 },
        10,
        2
      ),
      new systems.Thruster({ id: 203, hitpoints: 20, armor: 3 }, 10, 3, {
        power: 2,
        boostPower: 1,
        maxBoost: 10,
        thrustExtra: 0.2,
      }),

      new systems.PDC30mm(
        { id: 214, alwaysTargetable: true },
        { start: 0, end: 0 }
      ),

      new systems.Radiator5x40({ id: 316 }),
      new systems.CargoBay({ id: 317, hitpoints: 10, armor: 4 }, 100),
    ]);

    this.systems.addStarboardFrontSystem([
      new systems.PDC30mm(
        { id: 15, hitpoints: 5, armor: 3 },
        { start: 0, end: 180 }
      ),
    ]);

    this.systems.addStarboardAftSystem([
      new systems.PDC30mm(
        { id: 215, hitpoints: 5, armor: 3 },
        { start: 0, end: 180 }
      ),

      new systems.Radiator5x40({ id: 216 }),
    ]);

    this.systems.addPortFrontSystem([
      new systems.PDC30mm(
        { id: 13, hitpoints: 5, armor: 3 },
        { start: 180, end: 0 }
      ),
    ]);

    this.systems.addPortAftSystem([
      new systems.PDC30mm(
        { id: 213, hitpoints: 5, armor: 3 },
        { start: 180, end: 0 }
      ),

      new systems.Radiator5x40({ id: 416 }),
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
      object: new Ammo30mm(),
      amount: 120,
    });

    cargoService.divideCargo(this, {
      object: new Ammo120mmAP(),
      amount: 20,
    });

    cargoService.divideCargo(this, {
      object: new Ammo120mmHE(),
      amount: 20,
    });

    this.systems.getSystemById(108).callHandler("loadAmmoInstant", {
      ammo: new Torpedo72MSV(),
      launcherIndex: 1,
    });
    this.systems.getSystemById(108).callHandler("loadAmmoInstant", {
      ammo: new Torpedo72MSV(),
      launcherIndex: 2,
    });
  }
}

export default Fulcrum;
