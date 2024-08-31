import { expect, test } from "vitest";
import Ship, { ShipBase } from "../../../model/src/unit/Ship";
import AutoCannon85mm from "../../../model/src/unit/system/weapon/autocannon/AutoCannon85mm";
import CargoBay from "../../../model/src/unit/system/cargo/CargoBay";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import {
  Ammo85mmAP,
  Ammo85mmHE,
} from "../../../model/src/unit/system/weapon/ammunition/conventional";
import AmmunitionStrategy from "../../../model/src/unit/system/strategy/weapon/AmmunitionStrategy";
import Ammo from "../../../model/src/unit/system/weapon/ammunition/Ammo";
import DamageEntry from "../../../model/src/unit/system/DamageEntry";
import { CargoEntry } from "../../../model/src/cargo/CargoEntry";

const createShip = (
  data: ShipBase = {
    id: 1,
    shipData: {
      player: { id: 1, username: "u" },
    },
  } as unknown as ShipBase
) => {
  const ship = new Ship(data);
  const autoCannon = new AutoCannon85mm(
    {
      id: 1,
      hitpoints: 10,
      armor: 3,
    },
    { start: 0, end: 0 }
  );

  const cargoBay = new CargoBay({ id: 2, hitpoints: 20, armor: 4 }, 50);

  ship.systems.addPrimarySystem([autoCannon, cargoBay]);

  cargoBay.handlers.addCargo(new CargoEntry(new Ammo85mmAP(), 50));
  cargoBay.handlers.addCargo(new CargoEntry(new Ammo85mmHE(), 50));

  return ship;
};

test("Weapon builds initial magazine load correctly", () => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);

  autoCannon.handlers.loadTargetCargoInstant();

  expect(autoCannon.handlers.getAllCargo()).toEqual([
    new CargoEntry(new Ammo85mmAP(), 4),
    new CargoEntry(new Ammo85mmHE(), 10),
  ]);

  autoCannon.deserialize(autoCannon.serialize());

  expect(autoCannon.handlers.getAllCargo()).toEqual([
    new CargoEntry(new Ammo85mmAP(), 4),
    new CargoEntry(new Ammo85mmHE(), 10),
  ]);
});

test("Weapon that uses ammo can not fire without ammo", () => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);
  const cargoBay = ship.systems.getSystemById(2);

  expect(autoCannon.handlers.canFire()).toBe(false);
  autoCannon.handlers.loadTargetCargoInstant();
  expect(autoCannon.handlers.canFire()).toBe(true);
  autoCannon.deserialize(autoCannon.serialize());
  expect(autoCannon.handlers.canFire()).toBe(true);
});

test("Weapon that uses ammo consumes ammo when firing", () => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);
  const cargoBay = ship.systems.getSystemById(2);

  //const serverShip = createShip(ship.serialize());

  expect(autoCannon.handlers.getSelectedAmmo()).toEqual(new Ammo85mmHE());

  autoCannon.handlers.loadTargetCargoInstant();
  autoCannon.handlers.toggleSelectedAmmo();
  expect(autoCannon.handlers.getSelectedAmmo()).toEqual(new Ammo85mmAP());
  autoCannon.handlers.toggleSelectedAmmo();
  expect(autoCannon.handlers.getSelectedAmmo()).toEqual(new Ammo85mmHE());

  expect(autoCannon.handlers.getAllCargo()).toEqual([
    new CargoEntry(new Ammo85mmAP(), 4),
    new CargoEntry(new Ammo85mmHE(), 10),
  ]);

  autoCannon.handlers.onWeaponFired();

  expect(autoCannon.handlers.getAllCargo()).toEqual([
    new CargoEntry(new Ammo85mmAP(), 4),
    new CargoEntry(new Ammo85mmHE(), 8),
  ]);

  autoCannon.handlers.onWeaponFired();

  autoCannon.deserialize(autoCannon.serialize());

  expect(autoCannon.handlers.getAllCargo()).toEqual([
    new CargoEntry(new Ammo85mmAP(), 4),
    new CargoEntry(new Ammo85mmHE(), 6),
  ]);

  autoCannon.handlers.onWeaponFired();
  autoCannon.handlers.onWeaponFired();
  autoCannon.handlers.onWeaponFired();

  expect(autoCannon.handlers.getAllCargo()).toEqual([
    new CargoEntry(new Ammo85mmAP(), 4),
  ]);

  expect(autoCannon.handlers.canFire()).toBe(false);
  autoCannon.handlers.toggleSelectedAmmo();

  expect(autoCannon.handlers.getSelectedAmmo()).toEqual(new Ammo85mmAP());

  /*
  expect(
    autoCannon.callHandler(
      SYSTEM_HANDLERS.getAmmoInMagazine,
      undefined,
      [] as Ammo[]
    )
  ).toEqual([{ object: new Ammo85mmAP(), amount: 6 }]);

  expect(
    autoCannon.callHandler(
      SYSTEM_HANDLERS.getSelectedAmmo,
      undefined,
      null as unknown as Ammo
    )
  ).toEqual(new Ammo85mmAP());

  autoCannon.deserialize(autoCannon.serialize());

  expect(
    autoCannon.callHandler(
      SYSTEM_HANDLERS.getSelectedAmmo,
      undefined,
      null as unknown as Ammo
    )
  ).toEqual(new Ammo85mmAP());
  */
});

/*
test("Weapon target loading can be changed", () => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);
  const cargoBay = ship.systems.getSystemById(2);

  autoCannon.callHandler(SYSTEM_HANDLERS.loadTargetInstant, undefined, null);
  autoCannon.callHandler(
    SYSTEM_HANDLERS.setNewLoadingTarget,
    [
      { object: new Ammo85mmAP(), amount: 3 },
      { object: new Ammo85mmHE(), amount: 12 },
    ],
    undefined
  );

  const serverShip = createShip();
  const serverCannon = serverShip.systems.getSystemById(1);
  serverCannon.callHandler(SYSTEM_HANDLERS.loadTargetInstant, undefined, null);

  serverCannon.callHandler(
    SYSTEM_HANDLERS.receivePlayerData,
    { clientSystem: autoCannon },
    undefined
  );

  serverCannon.power.setOffline();
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);

  expect(
    serverCannon.callHandler(
      SYSTEM_HANDLERS.getAmmoInMagazine,
      undefined,
      [] as Ammo[]
    )
  ).toEqual([
    { object: new Ammo85mmAP(), amount: 3 },
    { object: new Ammo85mmHE(), amount: 12 },
  ]);
});

test("Empty magazine target loading can be changed", () => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);

  autoCannon.callHandler(
    SYSTEM_HANDLERS.setNewLoadingTarget,
    [
      { object: new Ammo85mmAP(), amount: 3 },
      { object: new Ammo85mmHE(), amount: 12 },
    ],
    undefined
  );

  const serverShip = createShip();
  const serverCannon = serverShip.systems.getSystemById(1);

  serverCannon.callHandler(
    SYSTEM_HANDLERS.receivePlayerData,
    { clientSystem: autoCannon },
    undefined
  );
  serverCannon.power.setOffline();
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);

  expect(
    serverCannon.callHandler(
      SYSTEM_HANDLERS.getAmmoInMagazine,
      undefined,
      [] as Ammo[]
    )
  ).toEqual([
    { object: new Ammo85mmAP(), amount: 3 },
    { object: new Ammo85mmHE(), amount: 3 },
  ]);

  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);

  expect(
    serverCannon.callHandler(
      SYSTEM_HANDLERS.getAmmoInMagazine,
      undefined,
      [] as CargoEntry[]
    )
  ).toEqual([
    { object: new Ammo85mmAP(), amount: 3 },
    { object: new Ammo85mmHE(), amount: 9 },
  ]);

  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);

  expect(
    serverCannon.callHandler(
      SYSTEM_HANDLERS.getAmmoInMagazine,
      undefined,
      [] as CargoEntry[]
    )
  ).toEqual([
    { object: new Ammo85mmAP(), amount: 3 },
    { object: new Ammo85mmHE(), amount: 12 },
  ]);
});

test("You can completely unload a weapon", () => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);

  autoCannon.callHandler(
    SYSTEM_HANDLERS.setNewLoadingTarget,
    [
      { object: new Ammo85mmAP(), amount: 0 },
      { object: new Ammo85mmHE(), amount: 0 },
    ],
    undefined
  );

  let serverShip = createShip();
  let serverCannon = serverShip.systems.getSystemById(1);

  serverCannon.callHandler(SYSTEM_HANDLERS.loadTargetInstant, undefined, null);
  serverCannon.callHandler(
    SYSTEM_HANDLERS.receivePlayerData,
    { clientSystem: autoCannon },
    undefined
  );
  serverCannon.power.setOffline();
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);

  expect(
    serverCannon.callHandler(
      SYSTEM_HANDLERS.getAmmoInMagazine,
      undefined,
      [] as CargoEntry[]
    )
  ).toEqual([{ object: new Ammo85mmHE(), amount: 9 }]);

  let serialized = serverCannon.serialize();
  serverShip = createShip();
  serverCannon = serverShip.systems.getSystemById(1);
  serverCannon.deserialize(serialized);
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);

  expect(
    serverCannon.callHandler(
      SYSTEM_HANDLERS.getAmmoInMagazine,
      undefined,
      [] as CargoEntry[]
    )
  ).toEqual([{ object: new Ammo85mmHE(), amount: 3 }]);

  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);

  expect(
    serverCannon.callHandler(
      SYSTEM_HANDLERS.getAmmoInMagazine,
      undefined,
      [] as CargoEntry[]
    )
  ).toEqual([]);

  serverCannon.deserialize(serverCannon.serialize());

  expect(
    serverCannon.callHandler(
      SYSTEM_HANDLERS.getLoadingTarget,
      undefined,
      [] as CargoEntry[]
    )
  ).toEqual([
    { object: new Ammo85mmAP(), amount: 0 },
    { object: new Ammo85mmHE(), amount: 0 },
  ]);
});

test("You can change the selected ammo", (test) => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);
  const cargoBay = ship.systems.getSystemById(2);

  expect(
    autoCannon.callHandler(
      SYSTEM_HANDLERS.getSelectedAmmo,
      undefined,
      null as unknown as Ammo
    )
  ).toEqual(new Ammo85mmHE());

  autoCannon.callHandler(
    SYSTEM_HANDLERS.setNewSelectedAmmo,
    new Ammo85mmAP(),
    undefined
  );

  const serverShip = createShip();
  const serverCannon = serverShip.systems.getSystemById(1);

  serverCannon.callHandler(SYSTEM_HANDLERS.loadTargetInstant, undefined, null);

  serverCannon.callHandler(
    SYSTEM_HANDLERS.receivePlayerData,
    { clientSystem: autoCannon },
    null
  );

  expect(
    serverCannon.callHandler(
      SYSTEM_HANDLERS.getSelectedAmmo,
      undefined,
      null as unknown as Ammo
    )
  ).toEqual(new Ammo85mmAP());
});

test("Unloading ammo with destroyed cargo bays is not possible", (test) => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);

  autoCannon.callHandler(SYSTEM_HANDLERS.loadTargetInstant, undefined, null);

  autoCannon.callHandler(
    SYSTEM_HANDLERS.setNewLoadingTarget,
    [
      { object: new Ammo85mmAP(), amount: 0 },
      { object: new Ammo85mmHE(), amount: 0 },
    ],
    undefined
  );

  const serverShip = createShip();
  const cargoBay = serverShip.systems.getSystemById(2);
  cargoBay.addDamage(new DamageEntry(400, 0));
  const serverCannon = serverShip.systems.getSystemById(1);
  serverCannon.callHandler(SYSTEM_HANDLERS.loadTargetInstant, undefined, null);

  serverCannon.callHandler(
    SYSTEM_HANDLERS.receivePlayerData,
    { clientSystem: autoCannon },
    undefined
  );

  serverCannon.power.setOffline();
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);

  expect(
    serverCannon.callHandler(
      SYSTEM_HANDLERS.getAmmoInMagazine,
      undefined,
      [] as CargoEntry[]
    )
  ).toEqual([
    { object: new Ammo85mmAP(), amount: 6 },
    { object: new Ammo85mmHE(), amount: 9 },
  ]);
});

test("Loading ammo with destroyed cargo bays is not possible", (test) => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);

  autoCannon.callHandler(SYSTEM_HANDLERS.loadTargetInstant, undefined, null);
  autoCannon.callHandler(
    SYSTEM_HANDLERS.setNewLoadingTarget,
    [
      { object: new Ammo85mmAP(), amount: 3 },
      { object: new Ammo85mmHE(), amount: 0 },
    ],
    undefined
  );

  const serverShip = createShip();
  const cargoBay = serverShip.systems.getSystemById(2);
  cargoBay.addDamage(new DamageEntry(400, 0));
  const serverCannon = serverShip.systems.getSystemById(1);

  serverCannon.getStrategiesByInstance<AmmunitionStrategy>(
    AmmunitionStrategy
  )[0].targetLoad = [
    { object: new Ammo85mmAP(), amount: 0 },
    { object: new Ammo85mmHE(), amount: 0 },
  ];

  serverCannon.callHandler(SYSTEM_HANDLERS.loadTargetInstant, undefined, null);

  serverCannon.callHandler(
    SYSTEM_HANDLERS.receivePlayerData,
    { clientSystem: autoCannon },
    undefined
  );
  serverCannon.power.setOffline();

  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);
  serverCannon.callHandler(SYSTEM_HANDLERS.advanceTurn, undefined, null);

  expect(
    serverCannon.callHandler(
      SYSTEM_HANDLERS.getAmmoInMagazine,
      undefined,
      [] as CargoEntry[]
    )
  ).toEqual([]);
});
*/
