import test from "ava";
import Ship from "../../model/unit/Ship.mjs";
import CargoBay from "../../model/unit/system/cargo/CargoBay.mjs";
import AutoCannon85mm from "../../model/unit/system/weapon/autocannon/AutoCannon85mm.mjs";
import {
  Ammo85mmAP,
  Ammo85mmHE
} from "../../model/unit/system/weapon/ammunition/conventional/index.mjs";
import AmmunitionStrategy from "../../model/unit/system/strategy/weapon/AmmunitionStrategy.mjs";

const createShip = (data = { id: 1 }) => {
  const ship = new Ship(data);
  const autoCannon = new AutoCannon85mm({
    id: 1,
    hitpoints: 10,
    armor: 3
  });
  const cargoBay = new CargoBay({ id: 2, hitpoints: 20, armor: 4 }, 50);

  ship.systems.addPrimarySystem([autoCannon, cargoBay]);

  cargoBay.callHandler("addCargo", {
    cargo: new Ammo85mmAP(),
    amount: 50
  });

  cargoBay.callHandler("addCargo", {
    cargo: new Ammo85mmHE(),
    amount: 50
  });

  return ship;
};

test("Weapon builds initial magazine load correctly", test => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);
  const cargoBay = ship.systems.getSystemById(2);

  autoCannon.callHandler("loadTargetInstant");
  test.deepEqual(autoCannon.callHandler("getAmmoInMagazine"), [
    { object: new Ammo85mmAP(), amount: 6 },
    { object: new Ammo85mmHE(), amount: 9 }
  ]);

  autoCannon.deserialize(autoCannon.serialize());

  test.deepEqual(autoCannon.callHandler("getAmmoInMagazine"), [
    { object: new Ammo85mmAP(), amount: 6 },
    { object: new Ammo85mmHE(), amount: 9 }
  ]);

  const strategy = autoCannon.getStrategiesByInstance(AmmunitionStrategy)[0];
  strategy.capacity = 16;
  test.deepEqual(autoCannon.callHandler("_buildInitialTargetLoad"), [
    { object: new Ammo85mmAP(), amount: 9 },
    { object: new Ammo85mmHE(), amount: 7 }
  ]);
});

test("Weapon that uses ammo can not fire without ammo", test => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);
  const cargoBay = ship.systems.getSystemById(2);

  //const serverShip = createShip(ship.serialize());

  test.false(autoCannon.callHandler("canFire"));
  autoCannon.callHandler("loadTargetInstant");
  test.true(autoCannon.callHandler("canFire"));
  autoCannon.deserialize(autoCannon.serialize());
  test.true(autoCannon.callHandler("canFire"));
});

test("Weapon that uses ammo consumes ammo when firing", test => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);
  const cargoBay = ship.systems.getSystemById(2);

  //const serverShip = createShip(ship.serialize());

  test.deepEqual(autoCannon.callHandler("getSelectedAmmo"), new Ammo85mmHE());
  autoCannon.callHandler("loadTargetInstant");
  autoCannon.callHandler("afterWeaponFire");
  test.deepEqual(autoCannon.callHandler("getAmmoInMagazine"), [
    { object: new Ammo85mmAP(), amount: 6 },
    { object: new Ammo85mmHE(), amount: 6 }
  ]);
  autoCannon.callHandler("afterWeaponFire");

  autoCannon.deserialize(autoCannon.serialize());
  test.deepEqual(autoCannon.callHandler("getAmmoInMagazine"), [
    { object: new Ammo85mmAP(), amount: 6 },
    { object: new Ammo85mmHE(), amount: 3 }
  ]);

  autoCannon.callHandler("afterWeaponFire");
  test.deepEqual(autoCannon.callHandler("getAmmoInMagazine"), [
    { object: new Ammo85mmAP(), amount: 6 }
  ]);

  test.deepEqual(autoCannon.callHandler("getSelectedAmmo"), new Ammo85mmAP());
  autoCannon.deserialize(autoCannon.serialize());
  test.deepEqual(autoCannon.callHandler("getSelectedAmmo"), new Ammo85mmAP());
});

test("Weapon target loading can be changed", test => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);
  const cargoBay = ship.systems.getSystemById(2);

  autoCannon.callHandler("loadTargetInstant");
  autoCannon.callHandler("setNewLoadingTarget", [
    { object: new Ammo85mmAP(), amount: 3 },
    { object: new Ammo85mmHE(), amount: 12 }
  ]);

  const serverShip = createShip();
  const serverCannon = serverShip.systems.getSystemById(1);
  serverCannon.callHandler("loadTargetInstant");

  serverCannon.callHandler("receivePlayerData", { clientSystem: autoCannon });
  serverCannon.power.setOffline();
  serverCannon.callHandler("advanceTurn");
  serverCannon.callHandler("advanceTurn");

  test.deepEqual(serverCannon.callHandler("getAmmoInMagazine"), [
    { object: new Ammo85mmAP(), amount: 3 },
    { object: new Ammo85mmHE(), amount: 12 }
  ]);
});

test("Empty magazine target loading can be changed", test => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);
  const cargoBay = ship.systems.getSystemById(2);

  autoCannon.callHandler("setNewLoadingTarget", [
    { object: new Ammo85mmAP(), amount: 3 },
    { object: new Ammo85mmHE(), amount: 12 }
  ]);

  const serverShip = createShip();
  const serverCannon = serverShip.systems.getSystemById(1);

  serverCannon.callHandler("receivePlayerData", { clientSystem: autoCannon });
  serverCannon.power.setOffline();
  serverCannon.callHandler("advanceTurn");
  serverCannon.callHandler("advanceTurn");

  test.deepEqual(serverCannon.callHandler("getAmmoInMagazine"), [
    { object: new Ammo85mmAP(), amount: 3 },
    { object: new Ammo85mmHE(), amount: 3 }
  ]);

  serverCannon.callHandler("advanceTurn");

  test.deepEqual(serverCannon.callHandler("getAmmoInMagazine"), [
    { object: new Ammo85mmAP(), amount: 3 },
    { object: new Ammo85mmHE(), amount: 9 }
  ]);

  serverCannon.callHandler("advanceTurn");

  test.deepEqual(serverCannon.callHandler("getAmmoInMagazine"), [
    { object: new Ammo85mmAP(), amount: 3 },
    { object: new Ammo85mmHE(), amount: 12 }
  ]);
});

test("You can completely unload a weapon", test => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);
  const cargoBay = ship.systems.getSystemById(2);

  autoCannon.callHandler("setNewLoadingTarget", [
    { object: new Ammo85mmAP(), amount: 0 },
    { object: new Ammo85mmHE(), amount: 0 }
  ]);

  const serverShip = createShip();
  const serverCannon = serverShip.systems.getSystemById(1);

  serverCannon.callHandler("loadTargetInstant");
  serverCannon.callHandler("receivePlayerData", { clientSystem: autoCannon });
  serverCannon.power.setOffline();
  serverCannon.callHandler("advanceTurn");
  serverCannon.callHandler("advanceTurn");

  console.log(serverCannon.callHandler("getAmmoInMagazine"));
  test.deepEqual(serverCannon.callHandler("getAmmoInMagazine"), [
    { object: new Ammo85mmHE(), amount: 9 }
  ]);
  /*
  serverCannon.callHandler("advanceTurn");

  test.deepEqual(serverCannon.callHandler("getAmmoInMagazine"), [
    { object: new Ammo85mmHE(), amount: 3 }
  ]);

  serverCannon.callHandler("advanceTurn");

  test.deepEqual(serverCannon.callHandler("getAmmoInMagazine"), []);
  serverCannon.deserialize(serverCannon.serialize());

  test.deepEqual(serverCannon.callHandler("getLoadingTarget"), []);
  */
});

test("You can change the selected ammo", test => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);
  const cargoBay = ship.systems.getSystemById(2);

  test.deepEqual(autoCannon.callHandler("getSelectedAmmo"), new Ammo85mmHE());
  autoCannon.callHandler("setNewSelectedAmmo", new Ammo85mmAP());
  const serverShip = createShip();
  const serverCannon = serverShip.systems.getSystemById(1);

  serverCannon.callHandler("loadTargetInstant");
  serverCannon.callHandler("receivePlayerData", { clientSystem: autoCannon });
  test.deepEqual(serverCannon.callHandler("getSelectedAmmo"), new Ammo85mmAP());
});