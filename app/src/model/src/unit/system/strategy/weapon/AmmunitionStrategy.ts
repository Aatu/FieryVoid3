import ShipSystemStrategy from "../ShipSystemStrategy";
import Ammo from "../../weapon/ammunition/Ammo";
import { AmmunitionType, createAmmoInstance } from "../../weapon/ammunition";
import { SYSTEM_HANDLERS } from "../types/SystemHandlersTypes";
import Ship from "../../../Ship";
import ShipSystem from "../../ShipSystem";
import {
  IShipSystemStrategy,
  SystemTooltipMenuButton,
} from "../../../ShipSystemHandlers";
import { CargoEntry } from "../../../../cargo/CargoEntry";

export type SerializedAmmunitionStrategy = {
  ammunitionStrategy: {
    selectedAmmo: AmmunitionType | null;
    changeSelectedAmmo: AmmunitionType | null;
  };
};

class AmmunitionStrategy
  extends ShipSystemStrategy
  implements IShipSystemStrategy
{
  public ammunitionClasses: AmmunitionType[];
  public ammoPerShot: number = 1;
  public selectedAmmo: Ammo;
  public changeSelectedAmmo: Ammo | null;

  constructor(ammunitionClasses: AmmunitionType[], ammoPerShot: number) {
    super();

    this.ammunitionClasses = ammunitionClasses;
    this.ammoPerShot = ammoPerShot ?? this.ammoPerShot;

    this.selectedAmmo = createAmmoInstance(
      this.ammunitionClasses[this.ammunitionClasses.length - 1]
    );

    this.changeSelectedAmmo = null;
  }

  getIconText(payload: unknown, previousResponse = "") {
    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    if (
      this.getSystem().callHandler(SYSTEM_HANDLERS.isLoaded, null, null) ===
      false
    ) {
      return previousResponse;
    }

    if (!this.selectedAmmo) {
      return "";
    }
    return this.selectedAmmo.getIconText();
  }

  getUiComponents(
    { myShip }: { myShip: boolean },
    previousResponse = []
  ): {
    name: string;
    props: { ammoStrategy: AmmunitionStrategy };
  }[] {
    if (!myShip) {
      return previousResponse;
    }

    if (this.getSystem().isDestroyed()) {
      return previousResponse;
    }

    return [
      ...previousResponse,
      {
        name: "Ammo",
        props: {
          ammoStrategy: this,
        },
      },
    ];
  }

  getTooltipMenuButton(
    payload?: { myShip?: boolean },
    previousResponse = []
  ): SystemTooltipMenuButton[] {
    if (!payload?.myShip) {
      return previousResponse;
    }

    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    return [
      ...previousResponse,
      {
        sort: 0,
        img:
          this.selectedAmmo?.getBackgroundImage() ?? "/img/system/noAmmo.png",
        clickHandler: () => {
          this.toggleSelectedAmmo();
        },
      },
    ];
  }

  serialize(
    payload: unknown,
    previousResponse = {}
  ): SerializedAmmunitionStrategy {
    return {
      ...previousResponse,
      ammunitionStrategy: {
        selectedAmmo: this.selectedAmmo?.getConstructorName(),
        changeSelectedAmmo: this.changeSelectedAmmo
          ? this.changeSelectedAmmo.getConstructorName()
          : null,
      },
    };
  }

  deserialize(data: Partial<SerializedAmmunitionStrategy>) {
    this.selectedAmmo = data?.ammunitionStrategy?.selectedAmmo
      ? createAmmoInstance(data?.ammunitionStrategy?.selectedAmmo)
      : createAmmoInstance(
          this.ammunitionClasses[this.ammunitionClasses.length - 1]
        );

    this.changeSelectedAmmo = data?.ammunitionStrategy?.changeSelectedAmmo
      ? createAmmoInstance(data?.ammunitionStrategy?.changeSelectedAmmo)
      : null;
  }

  toggleSelectedAmmo() {
    const allCargo = this.getSystem()
      .handlers.getAllCargo()
      .filter((c) =>
        this.ammunitionClasses.includes(c.object.getCargoClassName())
      );

    if (allCargo.length === 0) {
      return;
    }

    let index = allCargo.findIndex((c) => c.object.equals(this.selectedAmmo));

    if (index === -1) {
      this.selectedAmmo = allCargo[0].object.clone() as Ammo;
      return;
    }

    index++;

    if (index >= allCargo.length) {
      index = 0;
    }

    this.selectedAmmo = allCargo[index].object.clone() as Ammo;
  }

  getSelectedAmmo() {
    return this.selectedAmmo;
  }

  setNewSelectedAmmo(ammo: Ammo | null) {
    this.changeSelectedAmmo = ammo;
  }

  receivePlayerData({
    clientShip,
    clientSystem,
  }: {
    clientShip: Ship;
    clientSystem: ShipSystem;
  }) {
    if (!clientSystem) {
      return;
    }

    if (this.getSystem().power.isOffline()) {
      //this is fine
    } else if (this.getSystem().isDisabled()) {
      return;
    }

    const clientStrategy =
      clientSystem.getStrategiesByInstance<AmmunitionStrategy>(
        AmmunitionStrategy
      )[0];
    const changeSelectedAmmo = clientStrategy.selectedAmmo;

    if (changeSelectedAmmo) {
      if (
        !this.ammunitionClasses.includes(changeSelectedAmmo.getCargoClassName())
      ) {
        throw new Error(
          `Illegal selected ammo: '${changeSelectedAmmo.constructor.name}'`
        );
      }

      this.selectedAmmo = changeSelectedAmmo;
    }
  }

  shouldBeOffline(payload: unknown, previousResponse = false) {
    if (previousResponse === true) {
      return true;
    }

    const allCargo = this.getSystem()
      .handlers.getAllCargo()
      .filter((c) =>
        this.ammunitionClasses.includes(c.object.getCargoClassName())
      );

    if (
      allCargo.length === 0 ||
      allCargo.every((c) => c.amount < this.ammoPerShot)
    ) {
      return true;
    }

    return false;
  }

  canFire(payload: unknown, previousResponse = true) {
    if (previousResponse === false) {
      return false;
    }

    const entry = this.getSystem().handlers.getCargoEntry(this.selectedAmmo);

    if (!entry) {
      return false;
    }

    if (entry.amount < this.ammoPerShot) {
      return false;
    }

    return previousResponse;
  }

  onWeaponFired() {
    this.getSystem().handlers.removeCargo(
      new CargoEntry(this.selectedAmmo, this.ammoPerShot)
    );

    this.getSystem()
      .log.getGenericLogEntry()
      .addMessage(
        `Expended ordnance: ${
          this.ammoPerShot
        } x ${this.selectedAmmo.getDisplayName()}`
      );
  }

  advanceTurn() {
    this.changeSelectedAmmoIfOutOfAmmo();
  }

  private changeSelectedAmmoIfOutOfAmmo() {
    const allCargo = this.getSystem()
      .handlers.getAllCargo()
      .filter(
        (c) =>
          this.ammunitionClasses.includes(c.object.getCargoClassName()) &&
          c.amount >= this.ammoPerShot
      );

    const ammoForSelected = allCargo.find((c) =>
      c.object.equals(this.selectedAmmo)
    );

    if (ammoForSelected && ammoForSelected.amount >= this.ammoPerShot) {
      return;
    }

    if (allCargo.length === 0) {
      return;
    }

    this.selectedAmmo = allCargo[0].object.clone() as Ammo;
  }
}

export default AmmunitionStrategy;
