import Ship from "../../Ship.mjs";
import systems from "../../system/index.mjs";
import Torpedo158MSV from "../../system/weapon/ammunition/torpedo/Torpedo158MSV.mjs";
import Torpedo72MSV from "../../system/weapon/ammunition/torpedo/Torpedo72MSV.mjs";
import Torpedo72HE from "../../system/weapon/ammunition/torpedo/Torpedo72HE.mjs";

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
      new systems.Thruster({ id: 3, hitpoints: 10, armor: 3 }, 5, 3),
      new systems.Thruster({ id: 4, hitpoints: 10, armor: 3 }, 5, 3),
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

    this.systems.getSystemById(205).callHandler("setMaxFuel");

    const cargoBay = this.systems.getSystemById(204);

    cargoBay.callHandler("addCargo", {
      object: new Torpedo158MSV(),
      amount: 14,
    });

    cargoBay.callHandler("addCargo", {
      object: new Torpedo72MSV(),
      amount: 14,
    });

    this.systems.getSystemById(202).callHandler("loadAmmoInstant", {
      ammo: new Torpedo158MSV(),
      launcherIndex: 1,
    });
    this.systems.getSystemById(202).callHandler("loadAmmoInstant", {
      ammo: new Torpedo158MSV(),
      launcherIndex: 2,
    });

    this.systems.getSystemById(203).callHandler("loadAmmoInstant", {
      ammo: new Torpedo72MSV(),
      launcherIndex: 1,
    });
    this.systems.getSystemById(203).callHandler("loadAmmoInstant", {
      ammo: new Torpedo72MSV(),
      launcherIndex: 2,
    });

    this.systems.getSystemById(206).callHandler("loadAmmoInstant", {
      ammo: new Torpedo72HE(),
      launcherIndex: 1,
    });
    this.systems.getSystemById(206).callHandler("loadAmmoInstant", {
      ammo: new Torpedo72HE(),
      launcherIndex: 2,
    });

    return this;
  }
}

export default TestShip;
