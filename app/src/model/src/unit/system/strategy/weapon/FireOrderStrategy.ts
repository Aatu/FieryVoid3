import ShipSystemStrategy from "../ShipSystemStrategy.js";
import FireOrder from "../../../../weapon/FireOrder.mjs";
import CombatLogWeaponOutOfArc from "../../../../combatLog/CombatLogWeaponOutOfArc.mjs";
import CombatLogWeaponFire from "../../../../combatLog/CombatLogWeaponFire.mjs";
import GameData from "../../../../game/GameData.js";

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
      const weapon = this.system;
      const shooter = gameData.ships.getShipById(fireOrder.shooterId);
      const target = gameData.ships.getShipById(fireOrder.targetId);
      const weaponSettings = fireOrder.weaponSettings;

      /*
      if (!this.system.callHandler("isOnArc", { shooter, target })) {
        gameData.combatLog.addEntry(new CombatLogWeaponOutOfArc(fireOrder.id));
        return false;
      }
      */

      if (!this.system.callHandler("canFire", { shooter, target }, true)) {
        return false;
      }

      const combatLogEntry = new CombatLogWeaponFire(
        fireOrder.id,
        fireOrder.targetId,
        fireOrder.shooterId,
        weapon.callHandler("getSelectedAmmo", null, null)
      );

      const hitResolution = weapon.callHandler("checkFireOrderHits", {
        shooter,
        target,
        weaponSettings,
        gameData,
        fireOrder,
        combatLogEntry,
      });

      weapon.callHandler("applyDamageFromWeaponFire", {
        shooter,
        target,
        weaponSettings,
        gameData,
        fireOrder,
        combatLogEntry,
        hitResolution,
      });

      weapon.callHandler("onWeaponFired");
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

  addFireOrder({ shooter, target, weaponSettings }) {
    this.fireOrders = [];

    let shots = this.numberOfShots;
    while (shots--) {
      const order = new FireOrder(shooter, target, this.system, weaponSettings);
      this.fireOrders.push(order);
    }

    return this.fireOrders;
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      fireOrderStrategy: this.fireOrders.map((fire) => fire.serialize()),
    };
  }

  deserialize(data = {}) {
    this.fireOrders = data.fireOrderStrategy
      ? data.fireOrderStrategy.map((entry) =>
          new FireOrder().deserialize(entry)
        )
      : [];

    return this;
  }

  advanceTurn(turn) {
    this.fireOrders = [];
  }

  censorForUser({ mine }) {
    if (!mine) {
      this.fireOrders = [];
    }
  }

  onSystemOffline() {
    this.removeFireOrders();
  }
}

export default FireOrderStrategy;
