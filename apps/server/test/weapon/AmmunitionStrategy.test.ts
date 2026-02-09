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

test("Weapon that uses ammo can not fire without ammo", () => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);
  const cargoBay = ship.systems.getSystemById(2);

  expect(autoCannon.handlers.canFire()).toBe(true);
  const ammoStrategy =
    autoCannon.getStrategiesByInstance<AmmunitionStrategy>(
      AmmunitionStrategy
    )[0];

  ammoStrategy.shotsInMagazine = 0;

  expect(autoCannon.handlers.canFire()).toBe(false);

  ammoStrategy.shotsInMagazine = ammoStrategy.magazineSize;

  expect(autoCannon.handlers.canFire()).toBe(true);

  ship.shipCargo.removeAllCargo();

  expect(autoCannon.handlers.canFire()).toBe(false);
});

test("Weapon that uses ammo consumes ammo when firing", () => {
  const ship = createShip();
  const autoCannon = ship.systems.getSystemById(1);
  const cargoBay = ship.systems.getSystemById(2);

  //const serverShip = createShip(ship.serialize());

  expect(autoCannon.handlers.getSelectedAmmo()).toEqual(new Ammo85mmHE());
  autoCannon.handlers.toggleSelectedAmmo();
  expect(autoCannon.handlers.getSelectedAmmo()).toEqual(new Ammo85mmAP());
  autoCannon.handlers.toggleSelectedAmmo();
  expect(autoCannon.handlers.getSelectedAmmo()).toEqual(new Ammo85mmHE());

  let allCargo = ship.shipCargo
    .getAllCargo()
    .map((c) => c.toString())
    .join(", ");
  expect(allCargo).toEqual("Ammo85mmAP x 50, Ammo85mmHE x 50");
  autoCannon.handlers.onWeaponFired();

  allCargo = ship.shipCargo
    .getAllCargo()
    .map((c) => c.toString())
    .join(", ");
  expect(allCargo).toEqual("Ammo85mmAP x 50, Ammo85mmHE x 48");

  autoCannon.handlers.onWeaponFired();

  allCargo = ship.shipCargo
    .getAllCargo()
    .map((c) => c.toString())
    .join(", ");
  expect(allCargo).toEqual("Ammo85mmAP x 50, Ammo85mmHE x 46");

  const ammoStrategy =
    autoCannon.getStrategiesByInstance<AmmunitionStrategy>(
      AmmunitionStrategy
    )[0];

  expect(ammoStrategy.shotsInMagazine).toEqual(ammoStrategy.magazineSize - 4);
});
