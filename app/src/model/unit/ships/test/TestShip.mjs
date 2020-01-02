import Ship from "../../Ship.mjs";
import systems from "../../system/index.mjs";
import Torpedo158MSV from "../../system/weapon/ammunition/torpedo/Torpedo158MSV.mjs";
import Torpedo72MSV from "../../system/weapon/ammunition/torpedo/Torpedo72MSV.mjs";

class TestShip extends Ship {
  setShipProperties() {
    this.accelcost = 3;
    this.rollcost = 3;
    this.pivotcost = 3;
    this.evasioncost = 3;

    this.frontHitProfile = 1000;
    this.sideHitProfile = 1000;

    this.pointCost = 500;

    this.systems.addFrontSystem([
      new systems.TestWeapon({ id: 20, hitpoints: 6, armor: 2 }, [
        { start: 0, end: 0 }
      ]),
      new systems.RailgunTurreted2x140mm({ id: 101, hitpoints: 6, armor: 2 }, [
        { start: 0, end: 0 }
      ])
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
        6,
        3
      ),
      new systems.Engine({ id: 5, hitpoints: 10, armor: 3 }, 12, 6, 2),
      new systems.Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
      new systems.Reactor({ id: 7, hitpoints: 20, armor: 3 }, 26),
      new systems.EwArray({ id: 11, hitpoints: 10, armor: 3 }, 10),
      new systems.TorpedoLauncherDual158({ id: 202, hitpoints: 20, armor: 6 }),
      new systems.TorpedoLauncherDual72({ id: 203, hitpoints: 20, armor: 6 }),
      new systems.CargoBay({ id: 204, hitpoints: 20, armor: 4 }, 500)
    ]);
  }

  setShipLoadout() {
    super.setShipLoadout();

    const cargoBay = this.systems.getSystemById(204);

    cargoBay.callHandler("addCargo", {
      cargo: new Torpedo158MSV(),
      amount: 14
    });

    cargoBay.callHandler("addCargo", {
      cargo: new Torpedo72MSV(),
      amount: 14
    });

    this.systems.getSystemById(202).callHandler("loadAmmoInstant", {
      ammo: new Torpedo158MSV(),
      launcherIndex: 1
    });
    this.systems.getSystemById(202).callHandler("loadAmmoInstant", {
      ammo: new Torpedo158MSV(),
      launcherIndex: 2
    });

    this.systems.getSystemById(203).callHandler("loadAmmoInstant", {
      ammo: new Torpedo72MSV(),
      launcherIndex: 1
    });
    this.systems.getSystemById(203).callHandler("loadAmmoInstant", {
      ammo: new Torpedo72MSV(),
      launcherIndex: 2
    });
  }
}

export default TestShip;
