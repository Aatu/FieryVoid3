import ShipSystemStrategy from "../ShipSystemStrategy";
import FireOrder, { SerializedFireOrder } from "../../../../weapon/FireOrder";
import CombatLogWeaponFire from "../../../../combatLog/CombatLogWeaponFire";
import GameData from "../../../../game/GameData";
import { SYSTEM_HANDLERS } from "../types/SystemHandlersTypes";
import Ammo from "../../weapon/ammunition/Ammo";
import Ship from "../../../Ship";

export type SerializedFireOrderStrategy = {
  fireOrderStrategy?: SerializedFireOrder[];
};
class FireOrderStrategy extends ShipSystemStrategy {
  private numberOfShots: number;
  private resolutionPriority: number;
  private fireOrders: FireOrder[];

  constructor(numberOfShots = 1, resolutionPriority = 10) {
    super();

    this.numberOfShots = numberOfShots;
    this.resolutionPriority = resolutionPriority;

    this.fireOrders = [];
  }

  executeFireOrders({ gameData }: { gameData: GameData }) {
    this.fireOrders.forEach((fireOrder) => {
      const weapon = this.getSystem();
      const shooter = gameData.ships.getShipById(fireOrder.shooterId);
      const target = gameData.ships.getShipById(fireOrder.targetId);
      const weaponSettings = fireOrder.weaponSettings;

      /*
      if (!this.system.callHandler("isOnArc", { shooter, target })) {
        gameData.combatLog.addEntry(new CombatLogWeaponOutOfArc(fireOrder.id));
        return false;
      }
      */

      if (
        !this.getSystem().callHandler(
          SYSTEM_HANDLERS.canFire,
          { shooter, target },
          true
        )
      ) {
        return false;
      }

      const combatLogEntry = new CombatLogWeaponFire(
        fireOrder.getId(),
        fireOrder.targetId,
        fireOrder.shooterId,
        weapon.callHandler(
          SYSTEM_HANDLERS.getSelectedAmmo,
          null,
          null as Ammo | null
        )
      );

      const hitResolution = weapon.callHandler(
        SYSTEM_HANDLERS.checkFireOrderHits,
        {
          shooter,
          target,
          weaponSettings,
          gameData,
          fireOrder,
          combatLogEntry,
        },
        undefined
      );

      weapon.callHandler(
        SYSTEM_HANDLERS.applyDamageFromWeaponFire,
        {
          shooter,
          target,
          weaponSettings,
          gameData,
          fireOrder,
          combatLogEntry,
          hitResolution,
        },
        undefined
      );

      weapon.callHandler(SYSTEM_HANDLERS.onWeaponFired, undefined, undefined);
      fireOrder.setResolved();
      gameData.combatLog.addEntry(combatLogEntry);
    });
  }

  usesFireOrders() {
    return true;
  }

  getNumberOfShots() {
    return this.numberOfShots;
  }

  getFireOrderResolutionPriority() {
    return this.resolutionPriority;
  }

  hasFireOrder() {
    return this.fireOrders.length > 0;
  }

  getFireOrders() {
    return this.fireOrders;
  }

  removeFireOrders() {
    this.fireOrders = [];
  }

  addFireOrder({
    shooter,
    target,
    weaponSettings,
  }: {
    shooter: Ship;
    target: Ship;
    weaponSettings: Record<string, unknown>;
  }) {
    this.fireOrders = [];

    let shots = this.numberOfShots;
    while (shots--) {
      const order = new FireOrder(
        null,
        shooter,
        target,
        this.getSystem(),
        weaponSettings
      );
      this.fireOrders.push(order);
    }

    return this.fireOrders;
  }

  serialize(
    payload: unknown,
    previousResponse = []
  ): SerializedFireOrderStrategy {
    return {
      ...previousResponse,
      fireOrderStrategy: this.fireOrders.map((fire) => fire.serialize()),
    };
  }

  deserialize(data: SerializedFireOrderStrategy = {}) {
    this.fireOrders = data.fireOrderStrategy
      ? data.fireOrderStrategy.map((entry) => FireOrder.fromData(entry))
      : [];

    return this;
  }

  advanceTurn(turn: number) {
    this.fireOrders = [];
  }

  censorForUser({ mine }: { mine: boolean }) {
    if (!mine) {
      this.fireOrders = [];
    }
  }

  onSystemOffline() {
    this.removeFireOrders();
  }
}

export default FireOrderStrategy;
