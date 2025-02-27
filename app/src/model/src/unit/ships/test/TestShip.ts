import { CargoEntry } from "../../../cargo/CargoEntry";
import Ship from "../../Ship";
import systems from "../../system/index";
import {
  Ammo140mmAP,
  Ammo30mm,
} from "../../system/weapon/ammunition/conventional";
import {
  Torpedo158HE,
  Torpedo158MSV,
  Torpedo72HE,
  Torpedo72MSV,
} from "../../system/weapon/ammunition/torpedo";

class TestShip extends Ship {
  setShipProperties() {
    this.accelcost = 3;
    this.rollcost = 3;
    this.pivotcost = 3;
    this.evasioncost = 3;

    this.frontHitProfile = 100;
    this.sideHitProfile = 100;

    this.pointCost = 500;

    this.systems.addFrontSystem([
      new systems.OverPoweredTestWeapon({ id: 21, hitpoints: 6, armor: 2 }, [
        { start: 270, end: 90 },
      ]),
      new systems.TestWeapon({ id: 20, hitpoints: 6, armor: 2 }, [
        { start: 0, end: 180 },
      ]),
      new systems.RailgunTurreted2x140mm({ id: 101, hitpoints: 6, armor: 2 }, [
        { start: 0, end: 180 },
      ]),
      new systems.PDC30mm({ id: 102 }, [{ start: 0, end: 0 }]),
      new systems.PDC30mm({ id: 103 }, [{ start: 0, end: 0 }]),
    ]);

    this.systems.addPrimarySystem([
      new systems.Thruster({ id: 1, hitpoints: 10, armor: 3 }, 5, 0),
      new systems.Thruster({ id: 2, hitpoints: 10, armor: 3 }, 5, 0),
      new systems.Thruster({ id: 8, hitpoints: 10, armor: 3 }, 5, [1, 2]),
      new systems.Thruster({ id: 9, hitpoints: 10, armor: 3 }, 5, [4, 5]),
      new systems.Thruster({ id: 3, hitpoints: 10, armor: 3 }, 15, 3),
      new systems.Thruster({ id: 4, hitpoints: 10, armor: 3 }, 15, 3),
      new systems.ManeuveringThruster(
        { id: 10, hitpoints: 10, armor: 3 },
        9,
        3
      ),
      new systems.Engine({ id: 5, hitpoints: 10, armor: 3 }, 12, 6, 2),
      new systems.Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
      new systems.Reactor({ id: 7, hitpoints: 20, armor: 3 }, 35),
      new systems.EwArray({ id: 11, hitpoints: 10, armor: 3 }, 10),
      new systems.TorpedoLauncherDual158({ id: 202, hitpoints: 20, armor: 6 }),
      new systems.TorpedoLauncherDual72({ id: 203, hitpoints: 20, armor: 6 }),
      new systems.TorpedoLauncherDual72({ id: 206, hitpoints: 20, armor: 6 }),
      new systems.CargoBay({ id: 204, hitpoints: 20, armor: 4 }, 500),
      new systems.Structure({
        id: 205,
        hitpoints: 40,
        armor: 5,
        heatStorage: 200,
        radiator: 5,
        fuel: 4000,
      }),
    ]);
  }

  setShipLoadout() {
    super.setShipLoadout();

    this.shipCargo.addCargo([
      new CargoEntry(new Torpedo158MSV(), 14),
      new CargoEntry(new Torpedo72MSV(), 14),
      new CargoEntry(new Torpedo158HE(), 14),
      new CargoEntry(new Torpedo72HE(), 14),
      new CargoEntry(new Ammo30mm(), 14),
      new CargoEntry(new Ammo140mmAP(), 14),
    ]);
    /*

    this.systems
      .getSystemById(205)
      .callHandler(SYSTEM_HANDLERS.setMaxFuel, undefined, undefined);

    const cargoBay = this.systems.getSystemById(204);

    cargoBay.callHandler(
      SYSTEM_HANDLERS.addCargo,
      {
        object: new Torpedo158MSV(),
        amount: 14,
      },
      undefined
    );

    cargoBay.callHandler(
      SYSTEM_HANDLERS.addCargo,
      {
        object: new Torpedo72MSV(),
        amount: 14,
      },
      undefined
    );

    this.systems.getSystemById(202).callHandler(
      SYSTEM_HANDLERS.loadAmmoInstant,
      {
        ammo: new Torpedo158MSV(),
        launcherIndex: 1,
      },
      undefined
    );
    this.systems.getSystemById(202).callHandler(
      SYSTEM_HANDLERS.loadAmmoInstant,
      {
        ammo: new Torpedo158MSV(),
        launcherIndex: 2,
      },
      undefined
    );

    this.systems.getSystemById(203).callHandler(
      SYSTEM_HANDLERS.loadAmmoInstant,
      {
        ammo: new Torpedo72MSV(),
        launcherIndex: 1,
      },
      undefined
    );
    this.systems.getSystemById(203).callHandler(
      SYSTEM_HANDLERS.loadAmmoInstant,
      {
        ammo: new Torpedo72MSV(),
        launcherIndex: 2,
      },
      undefined
    );

    this.systems.getSystemById(206).callHandler(
      SYSTEM_HANDLERS.loadAmmoInstant,
      {
        ammo: new Torpedo72HE(),
        launcherIndex: 1,
      },
      undefined
    );
    this.systems.getSystemById(206).callHandler(
      SYSTEM_HANDLERS.loadAmmoInstant,
      {
        ammo: new Torpedo72HE(),
        launcherIndex: 2,
      },
      undefined
    );

    */
    return this;
  }
}

export class BareTestShip extends Ship {
  setShipProperties() {
    this.accelcost = 3;
    this.rollcost = 3;
    this.pivotcost = 3;
    this.evasioncost = 3;

    this.frontHitProfile = 100;
    this.sideHitProfile = 100;

    this.pointCost = 500;

    this.systems.addPrimarySystem([
      new systems.Reactor({ id: 7, hitpoints: 20, armor: 3 }, 35),
      new systems.EwArray({ id: 11, hitpoints: 10, armor: 3 }, 10),
      new systems.Structure({
        id: 205,
        hitpoints: 40,
        armor: 5,
        heatStorage: 200,
        radiator: 5,
        fuel: 4000,
      }),
    ]);
  }
}

export default TestShip;
