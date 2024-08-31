import CargoEntity from "../cargo/CargoEntity";
import { CargoEntry } from "../cargo/CargoEntry";
import CombatLogWeaponFireHitResult from "../combatLog/CombatLogWeaponFireHitResult";
import { IVector } from "../utils/Vector";
import WeaponHitChance from "../weapon/WeaponHitChance";
import Ship from "./Ship";
import ShipSystem, { ShipSystemType } from "./system/ShipSystem";
import { HitResolution } from "./system/strategy/weapon/StandardHitStrategy";
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
  getTooltipMenuButton: (payload: {
    myShip: boolean;
  }) => SystemTooltipMenuButton[];
  getNumberOfShots: (payload: unknown, previousResponse: number) => number;
  getBurstSize: (payload: unknown, previousResponse: number) => number;
  getBurstGrouping: (payload: unknown, previousResponse: number) => number;
  getUsedIntercepts: (payload: unknown, previousResponse: number) => number;
  canIntercept: (payload: unknown, previousResponse: boolean) => boolean;
  getInterceptChance: (
    payload: { target: Ship; torpedoFlight: TorpedoFlight },
    previousResponse: unknown
  ) => WeaponHitChance;
  isPositionOnArc: (
    payload: { targetPosition: IVector },
    previousResponse: undefined
  ) => boolean;
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
  getTimeToMoveCargoTo: () => number;
  hasCargo: (payload: CargoEntry[] | CargoEntry) => boolean;
  getAvailableCargoSpace: () => number;
  useCargoForSupply: () => boolean;
  isAllowedCargo: (cargo: CargoEntry) => boolean;
  getAllCargo: () => CargoEntry[];
  getCargoEntry: (cargo: CargoEntity) => CargoEntry<typeof cargo> | null;
  removeCargo: (cargo: CargoEntry) => void;
  removeAllCargo: () => void;
  getTargetCargo: () => CargoEntry[] | null;
  setTargetCargo: (cargo: CargoEntry[] | null) => void;
  addCargo: (cargo: CargoEntry | CargoEntry[]) => void;
  loadTargetCargoInstant: () => void;
  toggleSelectedAmmo: () => void;
  launchTorpedos: () => TorpedoFlight[];
  serialize: (
    payload: unknown,
    previousResponse: Record<string, unknown>
  ) => Record<string, unknown>;
  deserialize: (payload: Record<string, unknown>) => void;
  setLaunchTarget: (payload: { target: Ship; torpedo: Torpedo }) => void;
}

export type IShipSystemStrategy = IBaseShipSystemStrategy &
  Partial<IShipSystemHandlers>;

export type HandlerType = keyof IShipSystemStrategy;

export class SystemHandlers {
  private system: ShipSystem;

  constructor(system: ShipSystem) {
    this.system = system;
  }

  setLaunchTarget(payload: { target: Ship; torpedo: Torpedo }): void {
    this.callHandler("setLaunchTarget", undefined, payload);
  }

  deserialize(data: Record<string, unknown>) {
    this.callHandler("deserialize", undefined, data);
  }

  serialize() {
    return this.callHandler("serialize", {});
  }

  launchTorpedos(): TorpedoFlight[] {
    return this.callHandler("launchTorpedos") || [];
  }

  loadTargetCargoInstant() {
    this.callHandler("loadTargetCargoInstant");
  }

  getTargetCargo(): CargoEntry[] | null {
    return this.callHandler("getTargetCargo") || null;
  }

  setTargetCargo(cargo: CargoEntry[] | null) {
    this.callHandler("setTargetCargo", undefined, cargo);
  }

  addCargo(cargo: CargoEntry | CargoEntry[]) {
    this.callHandler("addCargo", undefined, cargo);
  }

  removeAllCargo() {
    this.callHandler("removeAllCargo");
  }

  removeCargo(cargo: CargoEntry): void {
    return this.callHandler("removeCargo", undefined, cargo);
  }

  getCargoEntry(cargo: CargoEntity): CargoEntry<typeof cargo> | null {
    return this.callHandler("getCargoEntry", undefined, cargo) || null;
  }

  getAllCargo(): CargoEntry[] {
    return this.callHandler("getAllCargo") || [];
  }

  isAllowedCargo(cargo: CargoEntry): boolean {
    return Boolean(this.callHandler("isAllowedCargo", undefined, cargo));
  }

  useCargoForSupply(): boolean {
    return Boolean(this.callHandler("useCargoForSupply"));
  }

  getAvailableCargoSpace(): number {
    return this.callHandler("getAvailableCargoSpace") || 0;
  }

  hasCargo(payload: CargoEntry[] | CargoEntry): boolean {
    return Boolean(this.callHandler("hasCargo", undefined, payload));
  }

  getTimeToMoveCargoTo(): number {
    return this.callHandler("getTimeToMoveCargoTo", 10);
  }

  hasCargoSpaceFor(entry: CargoEntry[] | CargoEntry): boolean {
    return Boolean(this.callHandler("hasCargoSpaceFor", undefined, entry));
  }

  isCargoBay(): boolean {
    return Boolean(this.callHandler("isCargoBay"));
  }

  applyDamageFromWeaponFire(payload: UnifiedDamagePayload) {
    this.callHandler("applyDamageFromWeaponFire", undefined, payload);
  }

  toggleSelectedAmmo() {
    return this.callHandler("toggleSelectedAmmo");
  }

  getSelectedAmmo(): Ammo | null {
    return this.callHandler("getSelectedAmmo") || null;
  }

  isAlwaysTargetable(): boolean {
    return Boolean(this.callHandler<boolean>("isAlwaysTargetable"));
  }

  getShipSystemType(previousResponse: ShipSystemType): ShipSystemType {
    return this.callHandler<ShipSystemType>(
      "getShipSystemType",
      previousResponse
    );
  }

  checkFireOrderHits(payload: HitResolution): CombatLogWeaponFireHitResult {
    return this.callHandler<CombatLogWeaponFireHitResult>(
      "checkFireOrderHits",
      undefined,
      payload
    );
  }

  onWeaponFired(): void {
    this.callHandler("onWeaponFired");
  }

  canFire(): boolean {
    return Boolean(this.callHandler<boolean>("canFire", true));
  }

  hasFireOrder(): boolean {
    return Boolean(this.callHandler<boolean>("hasFireOrder"));
  }

  isPositionOnArc(targetPosition: IVector): boolean {
    return Boolean(
      this.callHandler<boolean | undefined>("isPositionOnArc", undefined, {
        targetPosition,
      })
    );
  }

  getTooltipMenuButton(payload: {
    myShip: boolean;
  }): SystemTooltipMenuButton[] {
    return this.callHandler(
      "getTooltipMenuButton",
      [] as SystemTooltipMenuButton[],
      payload
    );
  }

  getInterceptChance(
    target: Ship,
    torpedoFlight: TorpedoFlight | TorpedoFlightForIntercept
  ): WeaponHitChance {
    if (!this.canIntercept()) {
      throw new Error("Cannot intercept");
    }

    return this.callHandler<WeaponHitChance>("getInterceptChance", undefined, {
      target,
      torpedoFlight,
    });
  }

  canIntercept(): boolean {
    return Boolean(this.callHandler<boolean>("canIntercept"));
  }

  getUsedIntercepts(): number {
    return this.callHandler<number>("getUsedIntercepts", 0);
  }

  addUsedIntercept(amount = 1): void {
    this.callHandler("addUsedIntercept", undefined, amount);
  }

  getNumberOfShots(): number {
    return this.callHandler<number>("getNumberOfShots", 1);
  }

  getBurstSize(): number {
    return this.callHandler<number>("getBurstSize", 1);
  }

  getBurstGrouping(): number {
    return this.callHandler<number>("getBurstGrouping", 0);
  }

  isBoostable(): boolean {
    return Boolean(this.callHandler<boolean>("isBoostable"));
  }

  canBoost(): boolean {
    return Boolean(this.callHandler<boolean>("canBoost"));
  }

  canDeBoost(): boolean {
    return Boolean(this.callHandler<boolean>("canDeBoost"));
  }

  getBoost(): number {
    return this.callHandler("getBoost") || 0;
  }

  boost(): void {
    this.callHandler("boost");
  }

  deBoost(): void {
    this.callHandler("deBoost");
  }

  private callHandler<T = unknown>(
    functionName: HandlerType,
    response?: T,
    payload?: unknown
  ): T {
    this.system.strategies.forEach((strategy) => {
      if (
        // @ts-expect-error I dont know how to type this
        typeof strategy[functionName] === "function"
      ) {
        // @ts-expect-error I dont know how to type this
        response = strategy[functionName](payload, response);
      }
    });

    return response as T;
  }
}
