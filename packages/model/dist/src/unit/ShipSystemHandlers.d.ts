import CargoEntity from "../cargo/CargoEntity";
import { CargoEntry } from "../cargo/CargoEntry";
import CombatLogWeaponFireHitResult from "../combatLog/CombatLogWeaponFireHitResult";
import { IVector } from "../utils/Vector";
import WeaponHitChance from "../weapon/WeaponHitChance";
import Ship from "./Ship";
import ShipSystem, { ShipSystemType } from "./system/ShipSystem";
import { THRUSTER_DIRECTION } from "./system/strategy/ThrustChannelSystemStrategy";
import { HitResolution } from "./system/strategy/weapon/StandardHitStrategy";
import { TorpedoLaunchOptions } from "./system/strategy/weapon/TorpedoLauncherStrategy";
import { UnifiedDamagePayload } from "./system/strategy/weapon/UnifiedDamageStrategy";
import Ammo from "./system/weapon/ammunition/Ammo";
import Torpedo from "./system/weapon/ammunition/torpedo/Torpedo";
import TorpedoFlight from "./TorpedoFlight";
import { TorpedoFlightForIntercept } from "./TorpedoFlightForIntercept";
interface IBaseShipSystemStrategy {
    init: (system: ShipSystem) => void;
}
export type SystemTooltipMenuButton = {
    sort: number;
    img: string;
    clickHandler: () => void;
    disabledHandler?: () => boolean;
};
export interface IShipSystemHandlers {
    isBoostable: (payload?: unknown, previousResponse?: boolean) => boolean;
    canBoost: (payload?: unknown, previousResponse?: boolean) => boolean;
    canDeBoost: (payload: unknown, previousResponse: unknown) => boolean;
    getBoost: (payload: unknown, previousResponse: number | undefined) => number;
    boost: (payload: unknown, previousResponse: unknown) => void;
    deBoost: (payload: unknown, previousResponse: unknown) => void;
    resetBoost: () => void;
    getTooltipMenuButton: (payload: {
        myShip: boolean;
    }) => SystemTooltipMenuButton[];
    getNumberOfShots: (payload: unknown, previousResponse: number) => number;
    getBurstSize: (payload: unknown, previousResponse: number) => number;
    getBurstGrouping: (payload: unknown, previousResponse: number) => number;
    getUsedIntercepts: (payload: unknown, previousResponse: number) => number;
    canIntercept: (payload: unknown, previousResponse: boolean) => boolean;
    getInterceptChance: (payload: {
        target: Ship;
        torpedoFlight: TorpedoFlight;
    }, previousResponse: unknown) => WeaponHitChance;
    isPositionOnArc: (payload: {
        targetPosition: IVector;
    }, previousResponse: undefined) => boolean;
    addUsedIntercept: (amount?: number) => void;
    hasFireOrder: () => boolean;
    canFire: (payload: unknown, previousResponse: boolean) => boolean;
    onWeaponFired: () => void;
    checkFireOrderHits: (payload: HitResolution) => CombatLogWeaponFireHitResult;
    getShipSystemType: (previousResponse: ShipSystemType) => ShipSystemType;
    isAlwaysTargetable: () => boolean;
    getSelectedAmmo: () => Ammo | null;
    applyDamageFromWeaponFire: (payload: UnifiedDamagePayload) => void;
    isCargoBay: () => boolean;
    hasCargoSpaceFor: (payload: CargoEntry[] | CargoEntry) => boolean;
    hasCargo: (payload: CargoEntry[] | CargoEntry) => boolean;
    getAvailableCargoSpace: () => number;
    isAllowedCargo: (cargo: CargoEntry) => boolean;
    getAllCargo: () => CargoEntry[];
    getCargoEntry: (cargo: CargoEntity) => CargoEntry<typeof cargo> | null;
    removeCargo: (cargo: CargoEntry | CargoEntry[]) => void;
    removeAllCargo: () => void;
    addCargo: (cargo: CargoEntry | CargoEntry[]) => void;
    toggleSelectedAmmo: () => void;
    launchTorpedos: () => TorpedoFlight[];
    serialize: (payload: unknown, previousResponse: Record<string, unknown>) => Record<string, unknown>;
    deserialize: (payload: Record<string, unknown>) => void;
    setLaunchTarget: (payload: {
        target: Ship;
        torpedo: Torpedo;
    }) => void;
    canAcceptCargo: (cargo: CargoEntry | CargoEntry[]) => boolean;
    isThrustDirection: (direction: THRUSTER_DIRECTION) => boolean;
    getTorpedoLaunchOptions: (payload: {
        target: Ship;
    }) => TorpedoLaunchOptions | null;
}
export type IShipSystemStrategy = IBaseShipSystemStrategy & Partial<IShipSystemHandlers>;
export type HandlerType = keyof IShipSystemStrategy;
export declare class SystemHandlers {
    private system;
    constructor(system: ShipSystem);
    getTorpedoLaunchOptions(target: Ship): TorpedoLaunchOptions | null;
    isThrustDirection(direction: THRUSTER_DIRECTION): boolean;
    setLaunchTarget(payload: {
        target: Ship;
        torpedo: Torpedo;
    }): void;
    deserialize(data: Record<string, unknown>): void;
    serialize(): {};
    launchTorpedos(): TorpedoFlight[];
    addCargo(cargo: CargoEntry | CargoEntry[]): void;
    removeAllCargo(): void;
    removeCargo(cargo: CargoEntry | CargoEntry[]): void;
    getCargoEntry(cargo: CargoEntity): CargoEntry<typeof cargo> | null;
    getAllCargo(): CargoEntry[];
    canAcceptCargo(cargo: CargoEntry | CargoEntry[]): boolean;
    isAllowedCargo(cargo: CargoEntry): boolean;
    getAvailableCargoSpace(): number;
    hasCargo(payload: CargoEntry[] | CargoEntry): boolean;
    hasCargoSpaceFor(entry: CargoEntry[] | CargoEntry): boolean;
    isCargoBay(): boolean;
    applyDamageFromWeaponFire(payload: UnifiedDamagePayload): void;
    toggleSelectedAmmo(): unknown;
    getSelectedAmmo(): Ammo | null;
    isAlwaysTargetable(): boolean;
    getShipSystemType(previousResponse: ShipSystemType): ShipSystemType;
    checkFireOrderHits(payload: HitResolution): CombatLogWeaponFireHitResult;
    onWeaponFired(): void;
    canFire(): boolean;
    hasFireOrder(): boolean;
    isPositionOnArc(targetPosition: IVector): boolean;
    getTooltipMenuButton(payload: {
        myShip: boolean;
    }): SystemTooltipMenuButton[];
    getInterceptChance(target: Ship, torpedoFlight: TorpedoFlight | TorpedoFlightForIntercept): WeaponHitChance;
    canIntercept(): boolean;
    getUsedIntercepts(): number;
    addUsedIntercept(amount?: number): void;
    getNumberOfShots(): number;
    getBurstSize(): number;
    getBurstGrouping(): number;
    resetBoost(): void;
    isBoostable(): boolean;
    canBoost(): boolean;
    canDeBoost(): boolean;
    getBoost(): number;
    boost(): void;
    deBoost(): void;
    private callHandler;
}
export {};
