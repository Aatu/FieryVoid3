import { CargoBaySystemStrategy } from ".";
import { CargoEntry } from "../../../cargo/CargoEntry";
import {
  AmmunitionType,
  createAmmoInstance,
  TorpedoType,
} from "../weapon/ammunition";

type AmmoAndAmount = Partial<Record<AmmunitionType | TorpedoType, number>>;

export class AmmoMagazineSystemStrategy extends CargoBaySystemStrategy {
  constructor(initialAmmo: AmmoAndAmount, timeToMoveTo?: number) {
    const spaceRequired = Object.keys(initialAmmo).reduce(
      (total, key) =>
        total +
        createAmmoInstance(key as AmmunitionType).getSpaceRequired() *
          initialAmmo[key as AmmunitionType | TorpedoType]!,
      0
    );

    super(
      spaceRequired,
      timeToMoveTo,
      Object.keys(initialAmmo) as (AmmunitionType | TorpedoType)[],
      false,
      false
    );

    this.setTargetCargo(
      Object.keys(initialAmmo).map(
        (key) =>
          new CargoEntry(
            createAmmoInstance(key as AmmunitionType | TorpedoType),
            initialAmmo[key as AmmunitionType | TorpedoType]
          )
      )
    );
  }
}
