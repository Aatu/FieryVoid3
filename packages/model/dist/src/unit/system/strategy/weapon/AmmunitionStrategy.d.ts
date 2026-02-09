import ShipSystemStrategy from "../ShipSystemStrategy";
import Ammo from "../../weapon/ammunition/Ammo";
import { AmmunitionType } from "../../weapon/ammunition";
import Ship from "../../../Ship";
import ShipSystem from "../../ShipSystem";
import { IShipSystemStrategy, SystemTooltipMenuButton } from "../../../ShipSystemHandlers";
export type SerializedAmmunitionStrategy = {
    ammunitionStrategy: {
        selectedAmmo: AmmunitionType;
        shotsInMagazine: number;
        turnsOffline: number;
    };
};
declare class AmmunitionStrategy extends ShipSystemStrategy implements IShipSystemStrategy {
    ammunitionClasses: AmmunitionType[];
    ammoPerShot: number;
    selectedAmmo: Ammo;
    shotsInMagazine: number;
    magazineSize: number;
    reloadingTime: number;
    turnsOffline: number;
    constructor(ammunitionClasses: AmmunitionType[], ammoPerShot: number, magazineSize: number, reloadingTime: number);
    getIconText(payload: unknown, previousResponse?: string): string;
    getUiComponents({ myShip }: {
        myShip: boolean;
    }, previousResponse?: never[]): {
        name: string;
        props: {
            ammoStrategy: AmmunitionStrategy;
        };
    }[];
    getTooltipMenuButton(payload?: {
        myShip?: boolean;
    }, previousResponse?: never[]): SystemTooltipMenuButton[];
    serialize(payload: unknown, previousResponse?: {}): SerializedAmmunitionStrategy;
    deserialize(data: Partial<SerializedAmmunitionStrategy>): void;
    toggleSelectedAmmo(): void;
    getSelectedAmmo(): Ammo;
    receivePlayerData({ clientShip, clientSystem, }: {
        clientShip: Ship;
        clientSystem: ShipSystem;
    }): void;
    shouldBeOffline(payload: unknown, previousResponse?: boolean): boolean;
    canFire(payload: unknown, previousResponse?: boolean): boolean;
    onWeaponFired(): void;
    advanceTurn(): void;
}
export default AmmunitionStrategy;
