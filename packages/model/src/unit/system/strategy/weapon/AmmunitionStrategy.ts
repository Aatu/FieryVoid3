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
    selectedAmmo: AmmunitionType;
    shotsInMagazine: number;
    turnsOffline: number;
  };
};

class AmmunitionStrategy
  extends ShipSystemStrategy
  implements IShipSystemStrategy
{
  public ammunitionClasses: AmmunitionType[];
  public ammoPerShot: number = 1;
  public selectedAmmo: Ammo;
  public shotsInMagazine: number;
  public magazineSize: number;
  public reloadingTime: number;
  public turnsOffline: number = 0;

  constructor(
    ammunitionClasses: AmmunitionType[],
    ammoPerShot: number,
    magazineSize: number,
    reloadingTime: number
  ) {
    super();

    this.ammunitionClasses = ammunitionClasses;
    this.ammoPerShot = ammoPerShot;
    this.shotsInMagazine = magazineSize;
    this.magazineSize = magazineSize;
    this.reloadingTime = reloadingTime;

    this.selectedAmmo = createAmmoInstance(
      this.ammunitionClasses[this.ammunitionClasses.length - 1]
    );
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
        selectedAmmo: this.selectedAmmo.getConstructorName(),
        shotsInMagazine: this.shotsInMagazine,
        turnsOffline: this.turnsOffline,
      },
    };
  }

  deserialize(data: Partial<SerializedAmmunitionStrategy>) {
    this.selectedAmmo = data?.ammunitionStrategy?.selectedAmmo
      ? createAmmoInstance(data?.ammunitionStrategy?.selectedAmmo)
      : createAmmoInstance(
          this.ammunitionClasses[this.ammunitionClasses.length - 1]
        );

    this.shotsInMagazine =
      data?.ammunitionStrategy?.shotsInMagazine ?? this.magazineSize;
    this.turnsOffline = data?.ammunitionStrategy?.turnsOffline ?? 0;
  }

  toggleSelectedAmmo() {
    const currentAmmoClass = this.selectedAmmo.getCargoClassName();
    let index =
      this.ammunitionClasses.findIndex(
        (className) => className === currentAmmoClass
      ) + 1;

    if (index >= this.ammunitionClasses.length) {
      index = 0;
    }

    this.selectedAmmo = createAmmoInstance(this.ammunitionClasses[index]);
  }

  getSelectedAmmo() {
    return this.selectedAmmo;
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

      this.selectedAmmo = createAmmoInstance(
        changeSelectedAmmo.getCargoClassName()
      );
    }
  }

  shouldBeOffline(payload: unknown, previousResponse = false) {
    if (previousResponse === true) {
      return true;
    }

    if (this.shotsInMagazine < this.ammoPerShot) {
      return true;
    }

    return false;
  }

  canFire(payload: unknown, previousResponse = true) {
    if (previousResponse === false) {
      return false;
    }

    if (this.shotsInMagazine < this.ammoPerShot) {
      return false;
    }

    if (
      !this.getShip().shipCargo.hasCargo(
        new CargoEntry(this.selectedAmmo, this.ammoPerShot)
      )
    ) {
      return false;
    }

    return previousResponse;
  }

  onWeaponFired() {
    this.getShip().shipCargo.removeCargo(
      new CargoEntry(this.selectedAmmo, this.ammoPerShot)
    );

    this.shotsInMagazine = this.shotsInMagazine - this.ammoPerShot;

    this.getSystem()
      .log.getGenericLogEntry()
      .addMessage(
        `Expended ordnance: ${
          this.ammoPerShot
        } x ${this.selectedAmmo.getDisplayName()}`
      );
  }

  advanceTurn() {
    if (this.getSystem().isDisabled()) {
      this.turnsOffline++;
    } else {
      this.turnsOffline = 0;
    }

    if (this.turnsOffline >= this.reloadingTime) {
      this.shotsInMagazine = this.magazineSize;
    }
  }
}

export default AmmunitionStrategy;
