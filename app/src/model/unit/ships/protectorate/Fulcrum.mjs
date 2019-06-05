import Ship from "../../Ship.mjs";
import systems from "../../system";

class Fulcrum extends Ship {
  constructor(data) {
    super(data);

    this.shipTypeName = "Arakaki Systems Fulcrum IV fleet destroyer";
    this.shipModel = this.accelcost = 3;
    this.rollcost = 3;
    this.pivotcost = 3;
    this.evasioncost = 3;

    this.description = `
       Fulcrum was ordered to fill the role of a fleet destroyer. A ship that packs enough of a punch in 
       sufficiently armored frame to engage in front line fleet combat. The design requirements allowed
       a considerable defieciency in endurance making the Fulcrum a ship that needs a supporting fleet
       to operate in a meaningful role on a modern battlefield. 

       Arakaki Systems won the contract with the Fulcrum design. Fulcrum sacrifices endurance, 
       heat management and some speed to bring on a battlefield a destroyed armed with a spinal
       mounted railgun, three kinetic cannons on a fixed bow mount, considerable six light PDCs 
       and a two missile launchers. All this in well armored spaceframe. 

       A squadron of Fulcrums can turn a fleet battle if employed properly, but their role and 
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

export default Fulcrum;
