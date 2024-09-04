import Ship from "../../Ship";
import systems from "../../system/index";

class Caliope extends Ship {
  setShipProperties() {
    this.shipTypeName = "Constantin battle ship";
    this.accelcost = 3;
    this.rollcost = 3;
    this.pivotcost = 3;
    this.evasioncost = 3;

    this.frontHitProfile = 45;
    this.sideHitProfile = 60;

    this.description = ``;

    this.shipModel = "Caliope";
    this.pointCost = 500;

    this.systems.addFrontSystem([
      new systems.Thruster({ id: 103, hitpoints: 10, armor: 3 }, 15, 0),
      new systems.PDC30mm(
        { id: 114, hitpoints: 5, armor: 3 },
        { start: 200, end: 160 }
      ),

      new systems.PDC30mm(
        { id: 115, hitpoints: 5, armor: 3 },
        { start: 200, end: 160 }
      ),
      new systems.Thruster({ id: 104, hitpoints: 10, armor: 3 }, 15, 0),
      new systems.Structure({
        id: 111,
        hitpoints: 40,
        armor: 5,
        heatStorage: 20,
        radiator: 3,
      }),

      new systems.ManeuveringThruster(
        { id: 101, hitpoints: 10, armor: 3 },
        10,
        3
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
        fuel: 2000,
      }),
      new systems.EwArray({ id: 12, hitpoints: 15, armor: 6 }, 8),
      new systems.HeatSink({ id: 13, hitpoints: 10, armor: 3 }, 100),
    ]);

    this.systems.addStarboardFrontSystem([
      new systems.Thruster({ id: 201, hitpoints: 10, armor: 3 }, 15, [1, 2]),

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
      new systems.Thruster({ id: 601, hitpoints: 10, armor: 3 }, 15, [4, 5]),

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
        10,
        3
      ),

      new systems.Thruster({ id: 431, hitpoints: 15, armor: 3 }, 15, 3),
      new systems.Thruster({ id: 432, hitpoints: 15, armor: 3 }, 15, 3),
      new systems.Thruster({ id: 433, hitpoints: 15, armor: 3 }, 15, 3),

      new systems.Structure({
        id: 411,
        hitpoints: 80,
        armor: 4,
        heatStorage: 100,
        radiator: 5,
        fuel: 4000,
      }),
      new systems.Radiator10x40({ id: 412, hitpoints: 10, armor: 3 }),
      new systems.Reactor({ id: 407, hitpoints: 10, armor: 3 }, 30),
      /*
      new systems.AutoCannon85mm(
        { id: 421, hitpoints: 6, armor: 3 },
        { start: 0, end: 0 }
      ),
      */
    ]);

    this.systems.addPortAftSystem([
      new systems.Radiator10x40({ id: 501 }),
      new systems.CargoBay({ id: 502, hitpoints: 20, armor: 4 }, 150),
      new systems.TorpedoLauncher158({ id: 503, hitpoints: 10, armor: 4 }),
      new systems.TorpedoLauncherDual72({ id: 504, hitpoints: 10, armor: 4 }),
      /*
      new systems.AutoCannon85mm(
        { id: 521, hitpoints: 6, armor: 3 },
        { start: 160, end: 30 }
      ),
      */
    ]);

    this.systems.addStarboardAftSystem([
      new systems.Radiator10x40({ id: 301 }),
      new systems.CargoBay({ id: 302, hitpoints: 20, armor: 4 }, 150),
      new systems.TorpedoLauncher158({ id: 303, hitpoints: 10, armor: 4 }),
      new systems.TorpedoLauncherDual72({ id: 304, hitpoints: 10, armor: 4 }),
      /*
      new systems.AutoCannon85mm(
        { id: 321, hitpoints: 6, armor: 3 },
        { start: 330, end: 200 }
      ),
      */
    ]);
  }

  setShipLoadout() {
    super.setShipLoadout();

    /*

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

    this.systems.getSystemById(303).callHandler(
      SYSTEM_HANDLERS.loadAmmoInstant,
      {
        ammo: new Torpedo158MSV(),
        launcherIndex: 1,
      },
      undefined
    );

    this.systems.getSystemById(503).callHandler(
      SYSTEM_HANDLERS.loadAmmoInstant,
      {
        ammo: new Torpedo158MSV(),
        launcherIndex: 1,
      },
      undefined
    );

    this.systems.getSystemById(304).callHandler(
      SYSTEM_HANDLERS.loadAmmoInstant,
      {
        ammo: new Torpedo72MSV(),
        launcherIndex: 1,
      },
      undefined
    );
    this.systems.getSystemById(304).callHandler(
      SYSTEM_HANDLERS.loadAmmoInstant,
      {
        ammo: new Torpedo72HE(),
        launcherIndex: 2,
      },
      undefined
    );

    this.systems.getSystemById(504).callHandler(
      SYSTEM_HANDLERS.loadAmmoInstant,
      {
        ammo: new Torpedo72MSV(),
        launcherIndex: 1,
      },
      undefined
    );
    this.systems.getSystemById(504).callHandler(
      SYSTEM_HANDLERS.loadAmmoInstant,
      {
        ammo: new Torpedo72HE(),
        launcherIndex: 2,
      },
      undefined
    );
    */
  }
}

export default Caliope;
