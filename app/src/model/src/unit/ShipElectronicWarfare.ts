import ElectronicWarfareEntry from "../electronicWarfare/ElectronicWarfareEntry";
import { EW_TYPE } from "../electronicWarfare/electronicWarfareTypes";
import Ship from "./Ship";
import ShipCurrentElectronicWarfare, {
  SearializedShipCurrentElectronicWarfare,
} from "./ShipCurrentElectronicWarfare";
import ShipSystem from "./system/ShipSystem";
import { SYSTEM_HANDLERS } from "./system/strategy/types/SystemHandlersTypes";

export class UnableToAssignEw extends Error {}

class ShipElectronicWarfare {
  public ship: Ship;
  public inEffect: ShipCurrentElectronicWarfare;

  constructor(ship: Ship) {
    this.ship = ship;
    this.inEffect = new ShipCurrentElectronicWarfare(0, 0, []);
  }

  serialize(): SearializedShipCurrentElectronicWarfare {
    return this.inEffect.serialize();
  }

  deserialize(data: SearializedShipCurrentElectronicWarfare = {}) {
    this.inEffect.deserialize(data);

    return this;
  }

  activatePlannedElectronicWarfare() {
    this.inEffect = new ShipCurrentElectronicWarfare(
      this.getDefensiveEw(),
      this.getCcEw(),
      this.getAllEntries()
    );
  }

  canAssignCcEw(amount: number) {
    return this.canAssignEw(EW_TYPE.CC, this.ship.getId(), amount);
  }

  assignCcEw(amount: number) {
    this.assingEw(EW_TYPE.CC, this.ship.getId(), amount);
  }

  assignOffensiveEw(target: Ship | string, amount: number) {
    this.assingEw(EW_TYPE.OFFENSIVE, target, amount);
  }

  canAssignOffensiveEw(target: Ship | string, amount: number) {
    return this.canAssignEw(EW_TYPE.OFFENSIVE, target, amount);
  }

  getCcEw() {
    return this.getEw(EW_TYPE.CC, this.ship.getId());
  }

  getDefensiveEw() {
    return this.getEw(EW_TYPE.DEFENSIVE, this.ship.getId());
  }

  getOffensiveEw(target: Ship | string) {
    return this.getEw(EW_TYPE.OFFENSIVE, target);
  }

  getEw(type: EW_TYPE, target: Ship | string): number {
    if (target && target instanceof Ship) {
      target = target.getId();
    }

    if (type === EW_TYPE.DEFENSIVE) {
      return this.getEwArrays().reduce(
        (total, system) =>
          total +
          system.callHandler(SYSTEM_HANDLERS.getTotalEwUsedByType, type, 0),
        0
      );
    }

    const result = this.getAllEntries()
      .filter((entry) => entry.type === type && entry.targetShipId === target)
      .reduce((total, entry) => total + entry.getAmount(), 0);

    return result;
  }

  assingEw(type: EW_TYPE, target: Ship | string, amount: number) {
    if (target && target instanceof Ship) {
      target = target.getId();
    }

    const entries = this.getAllEntries();
    entries.push(new ElectronicWarfareEntry(type, target, amount));

    this.assignEntries(entries);
  }

  canAssignEw(type: EW_TYPE, target: Ship | string, amount: number) {
    const entries = this.getAllEntries();
    try {
      this.assingEw(type, target, amount);
      this.assignEntries(entries);
      return true;
    } catch (e) {
      if (e instanceof UnableToAssignEw) {
        this.assignEntries(entries);
        return false;
      }

      throw e;
    }
  }

  getAllOew(): ElectronicWarfareEntry[] {
    const combined: ElectronicWarfareEntry[] = [];

    this.getEwArrays()
      .reduce(
        (all, system) => [
          ...all,
          ...system.callHandler(
            SYSTEM_HANDLERS.getEwEntries,
            null,
            [] as ElectronicWarfareEntry[]
          ),
        ],
        [] as ElectronicWarfareEntry[]
      )
      .filter((entry) => entry.getType() === EW_TYPE.OFFENSIVE)
      .forEach((entry) => {
        const existing = combined.find(
          (combinedEntry) => combinedEntry.targetShipId === entry.targetShipId
        );

        if (existing) {
          existing.amount += entry.amount;
        } else {
          combined.push(entry.clone());
        }
      });

    return combined;
  }

  getAllEntries() {
    return this.getEwArrays().reduce(
      (all, system) => [
        ...all,
        ...system.callHandler(
          SYSTEM_HANDLERS.getEwEntries,
          null,
          [] as ElectronicWarfareEntry[]
        ),
      ],
      [] as ElectronicWarfareEntry[]
    );
  }

  getEwArrays(): ShipSystem[] {
    return this.ship.systems
      .getSystems()
      .filter((system) =>
        system.callHandler(SYSTEM_HANDLERS.isEwArray, null, false)
      );
  }

  repeatElectonicWarfare() {
    this.assignEntries(this.getAllEntries(), true);
  }

  removeAll() {
    this.getEwArrays().forEach((system) =>
      system.callHandler(SYSTEM_HANDLERS.resetEw, null, false)
    );
  }

  assignEntries(entries: ElectronicWarfareEntry[], allowIncomplete = false) {
    this.removeAll();
    const negativeEntries = entries.filter((entry) => entry.getAmount() < 0);

    entries
      .filter((entry) => entry.getAmount() > 0)
      .sort((a, b) => {
        if (a.type === EW_TYPE.OFFENSIVE && b.type !== EW_TYPE.OFFENSIVE) {
          return 1;
        }

        if (a.type !== EW_TYPE.OFFENSIVE && b.type === EW_TYPE.OFFENSIVE) {
          return -1;
        }

        return 0;
      })
      .map((entry) => {
        negativeEntries
          .filter(
            (negativeEntry) =>
              negativeEntry.type === entry.type &&
              negativeEntry.targetShipId === entry.targetShipId
          )
          .forEach((negativeEntry) => {
            if (entry.getAmount() >= Math.abs(negativeEntry.getAmount())) {
              entry.amount += negativeEntry.getAmount();
              negativeEntry.amount = 0;
            } else if (
              Math.abs(negativeEntry.getAmount()) > entry.getAmount()
            ) {
              negativeEntry.amount += entry.getAmount();
              entry.amount = 0;
            }
          });

        return entry;
      })
      .filter((entry) => entry.getAmount() !== 0)
      .forEach((entry) => this.assignPositiveEW(entry, allowIncomplete));

    if (negativeEntries.some((entry) => entry.getAmount() !== 0)) {
      throw new UnableToAssignEw("Invalid EW, negative entries left");
    }
  }

  assignPositiveEW(entry: ElectronicWarfareEntry, allowIncomplete: boolean) {
    let amount = entry.getAmount();
    while (amount > 0) {
      const availableSystems = this.getAvailableSystemsForEntry(entry);

      if (availableSystems.length === 0) {
        if (allowIncomplete) {
          return;
        } else {
          throw new UnableToAssignEw("Invalid EW");
        }
      }

      availableSystems.shift()?.callHandler(
        SYSTEM_HANDLERS.assignEw,
        {
          type: entry.type,
          target: entry.targetShipId,
          amount: 1,
        },
        undefined
      );
      amount--;
    }
  }

  getAvailableSystemsForEntry(entry: ElectronicWarfareEntry) {
    return this.getEwArrays()
      .filter((system) =>
        system.callHandler(
          SYSTEM_HANDLERS.canUseEw,
          {
            type: entry.type,
            amount: 1,
          },
          undefined
        )
      )
      .sort((a, b) => {
        const aValidTypes = a.callHandler(
          SYSTEM_HANDLERS.getValidEwTypes,
          undefined,
          [] as EW_TYPE[]
        );
        const bValidTypes = b.callHandler(
          SYSTEM_HANDLERS.getValidEwTypes,
          undefined,
          [] as EW_TYPE[]
        );

        if (aValidTypes.length > bValidTypes.length) {
          return -1;
        } else if (aValidTypes.length < bValidTypes.length) {
          return 1;
        }

        return 0;
      });
  }
}

export default ShipElectronicWarfare;
