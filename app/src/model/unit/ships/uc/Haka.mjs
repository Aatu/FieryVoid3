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
import Torpedo158MSV2 from "../../system/weapon/ammunition/torpedo/Torpedo158MSV2.mjs";
import Torpedo158HE from "../../system/weapon/ammunition/torpedo/Torpedo158HE.mjs";

class Haka extends Ship {
  setShipProperties() {
    this.shipTypeName = "Haka XCD-33 Battleship";
    this.hexSizes = [
      new Offset(2, 0),
      new Offset(1, 0),
      new Offset(0, 0),
      new Offset(-1, 0),
    ];
    this.accelcost = 5;
    this.rollcost = 12;
    this.pivotcost = 10;
    this.evasioncost = 10;

    this.frontHitProfile = 70;
    this.sideHitProfile = 100;

    this.description = ``;

    this.shipModel = "Haka";
    this.pointCost = 500;

    this.systems.addFrontSystem([
      new systems.ChemicalThruster({ id: 103, hitpoints: 10, armor: 3 }, 15, 0),

      new systems.RailgunTurreted140mmUC({ id: 118 }, { start: 210, end: 150 }),
      new systems.RailgunTurreted140mmUC({ id: 119 }, { start: 210, end: 150 }),
      new systems.ChemicalThruster({ id: 104, hitpoints: 10, armor: 3 }, 15, 0),

      new systems.PDC30mm(
        { id: 114, hitpoints: 5, armor: 3 },
        { start: 200, end: 160 }
      ),

      new systems.PDC30mm(
        { id: 115, hitpoints: 5, armor: 3 },
        { start: 200, end: 160 }
      ),

      new systems.PDC30mm(
        { id: 116, hitpoints: 5, armor: 3 },
        { start: 200, end: 160 }
      ),

      new systems.PDC30mm(
        { id: 117, hitpoints: 5, armor: 3 },
        { start: 200, end: 160 }
      ),

      new systems.EwArray(
        {
          id: 120,
          hitpoints: 10,
          armor: 5,
          boostable: false,
          heat: 7,
          power: 13,
          overheatTransferRatio: 0.2,
        },
        5
      ),

      new systems.OEWArray(
        {
          id: 121,
          hitpoints: 10,
          armor: 5,
          boostable: false,
          heat: 6,
          power: 8,
          overheatTransferRatio: 0.2,
        },
        5
      ),

      new systems.Structure({
        id: 111,
        hitpoints: 80,
        armor: 4,
        cargoSpace: 400,
        radiator: 15,
      }),
    ]);

    this.systems.addPrimarySystem([
      new systems.Reactor({ id: 7, hitpoints: 10, armor: 8 }, 43),
      new systems.Reactor({ id: 5, hitpoints: 10, armor: 8 }, 43),
      new systems.Structure({
        id: 11,
        hitpoints: 80,
        armor: 6,
        cargoSpace: 300,
        heatStorage: 50,
      }),
      new systems.EwArray({ id: 12, hitpoints: 25, armor: 6, heat: 10 }, 10),
      new systems.HeatSink({ id: 13, hitpoints: 10, armor: 3 }, 100),
      new systems.HeatSink({ id: 14, hitpoints: 10, armor: 3 }, 100),
    ]);

    this.systems.addStarboardFrontSystem([
      new systems.ChemicalThruster({ id: 201, hitpoints: 10, armor: 3 }, 5, [
        1,
        2,
      ]),

      new systems.ManeuveringThrusterRight(
        { id: 205, hitpoints: 10, armor: 3 },
        10,
        0
      ),

      new systems.RailgunTurreted2x140mm({ id: 202 }, { start: 345, end: 150 }),

      new systems.TorpedoLauncherQuadruple158({
        id: 210,
        hitpoints: 15,
        armor: 3,
      }),
      new systems.TorpedoLauncherQuadruple158({
        id: 211,
        hitpoints: 15,
        armor: 3,
      }),
      new systems.TorpedoLauncherQuadruple158({
        id: 212,
        hitpoints: 15,
        armor: 3,
      }),
      new systems.TorpedoLauncherQuadruple158({
        id: 213,
        hitpoints: 15,
        armor: 3,
      }),
    ]);

    this.systems.addPortFrontSystem([
      new systems.Structure({
        id: 600,
        hitpoints: 60,
        armor: 7,
        radiator: 15,
      }),

      new systems.ChemicalThruster({ id: 601, hitpoints: 10, armor: 3 }, 5, [
        4,
        5,
      ]),

      new systems.MediumCoilcunTurretedUC({ id: 602 }, { start: 165, end: 0 }),

      new systems.RailgunTurreted140mmUC(
        { id: 603 },
        { start: 195, end: 3.75 }
      ),
      new systems.RailgunTurreted140mmUC(
        { id: 604 },
        { start: 195, end: 3.75 }
      ),

      new systems.ManeuveringThrusterLeft(
        { id: 605, hitpoints: 10, armor: 3 },
        10,
        0
      ),

      new systems.MediumCoilcunTurretedUC({ id: 606 }, { start: 210, end: 15 }),
    ]);

    this.systems.addAftSystem([
      new systems.Structure({
        id: 411,
        hitpoints: 80,
        armor: 5,
        heatStorage: 100,
        radiator: 5,
        fuel: 12000,
      }),

      new systems.PDC30mm({ id: 450 }, { start: 160, end: 340 }),

      new systems.Thruster({ id: 432, hitpoints: 15, armor: 3 }, 15, 3, {
        power: 3,
        boostPower: 2,
      }),
      new systems.Thruster({ id: 433, hitpoints: 15, armor: 3 }, 15, 3, {
        power: 3,
        boostPower: 2,
      }),

      new systems.PDC30mm({ id: 451 }, { start: 40, end: 200 }),

      new systems.PDC30mm({ id: 452 }, { start: 160, end: 340 }),
      new systems.PDC30mm({ id: 453 }, { start: 160, end: 340 }),

      new systems.PDC30mm({ id: 456 }, { start: 40, end: 200 }),
      new systems.PDC30mm({ id: 457 }, { start: 40, end: 200 }),

      new systems.PDC30mm({ id: 454 }, { start: 160, end: 340 }),
      new systems.PDC30mm({ id: 455 }, { start: 40, end: 200 }),
    ]);

    this.systems.addPortAftSystem([
      new systems.Thruster({ id: 533, hitpoints: 15, armor: 3 }, 15, 3, {
        power: 3,
        boostPower: 2,
      }),
      new systems.ManeuveringThrusterRight(
        { id: 501, hitpoints: 10, armor: 3 },
        10,
        0
      ),
      new systems.Radiator10x50({ id: 502 }),
      new systems.Radiator10x50({ id: 503 }),
      new systems.PDC30mm({ id: 550 }, { start: 160, end: 340 }),
      new systems.PDC30mm({ id: 551 }, { start: 160, end: 340 }),

      new systems.PDC30mm({ id: 554 }, { start: 160, end: 340 }),
      new systems.PDC30mm({ id: 555 }, { start: 160, end: 340 }),
    ]);

    this.systems.addStarboardAftSystem([
      new systems.ManeuveringThrusterLeft(
        { id: 305, hitpoints: 10, armor: 3 },
        10,
        0
      ),
      new systems.Thruster({ id: 333, hitpoints: 15, armor: 3 }, 15, 3, {
        power: 3,
        boostPower: 2,
      }),
      new systems.Radiator10x50({ id: 301 }),
      new systems.Radiator10x50({ id: 302 }),
      new systems.PDC30mm({ id: 352 }, { start: 40, end: 200 }),
      new systems.PDC30mm({ id: 353 }, { start: 40, end: 200 }),
      new systems.PDC30mm({ id: 356 }, { start: 40, end: 200 }),

      new systems.PDC30mm({ id: 357 }, { start: 40, end: 200 }),
    ]);
  }

  setShipLoadout() {
    super.setShipLoadout();

    const cargoService = new CargoService();

    cargoService.divideCargo(this, {
      object: new Torpedo158MSV(),
      amount: 24,
    });

    cargoService.divideCargo(this, {
      object: new Torpedo158MSV2(),
      amount: 20,
    });

    cargoService.divideCargo(this, {
      object: new Torpedo158HE(),
      amount: 36,
    });

    cargoService.divideCargo(this, {
      object: new Torpedo158Nuclear(),
      amount: 6,
    });

    cargoService.divideCargo(this, {
      object: new Ammo30mm(),
      amount: 1700,
    });

    cargoService.divideCargo(this, {
      object: new Ammo140mmAP(),
      amount: 220,
    });

    cargoService.divideCargo(this, {
      object: new Ammo140mmHE(),
      amount: 550,
    });

    const launchers = [
      this.systems.getSystemById(210),
      this.systems.getSystemById(211),
      this.systems.getSystemById(212),
      this.systems.getSystemById(213),
    ];

    launchers.forEach((system) => {
      system.callHandler("loadAmmoInstant", {
        ammo: new Torpedo158MSV(),
        launcherIndex: 1,
      });
      system.callHandler("loadAmmoInstant", {
        ammo: new Torpedo158MSV(),
        launcherIndex: 2,
      });
      system.callHandler("loadAmmoInstant", {
        ammo: new Torpedo158MSV2(),
        launcherIndex: 3,
      });

      system.callHandler("loadAmmoInstant", {
        ammo: new Torpedo158HE(),
        launcherIndex: 4,
      });
    });
  }
}

export default Haka;
