import * as Yup from "yup";
import Ship from "./Ship";
import { InterceptionPriority } from "./TorpedoFlight";

export type SerializedShipTorpedoDefense = {
  minHitChangeLowPriority: number;
  minHitChangeMediumPriority: number;
  minHitChangeHighPriority: number;
  otherShipInterceptionMod: number;
};

export class ShipTorpedoDefense {
  public minHitChangeLowPriority: number = 50;
  public minHitChangeMediumPriority: number = 20;
  public minHitChangeHighPriority: number = 10;
  public otherShipInterceptionMod: number = 10;

  constructor(args: Partial<SerializedShipTorpedoDefense> = {}) {
    this.deserialize(args);
  }

  public deserialize(args?: Partial<SerializedShipTorpedoDefense>) {
    this.minHitChangeLowPriority =
      args?.minHitChangeLowPriority || this.minHitChangeLowPriority;
    this.minHitChangeMediumPriority =
      args?.minHitChangeMediumPriority || this.minHitChangeMediumPriority;
    this.minHitChangeHighPriority =
      args?.minHitChangeHighPriority || this.minHitChangeHighPriority;
    this.otherShipInterceptionMod =
      args?.otherShipInterceptionMod || this.otherShipInterceptionMod;
  }

  public serialize(): SerializedShipTorpedoDefense {
    return {
      minHitChangeLowPriority: this.minHitChangeLowPriority,
      minHitChangeMediumPriority: this.minHitChangeMediumPriority,
      minHitChangeHighPriority: this.minHitChangeHighPriority,
      otherShipInterceptionMod: this.otherShipInterceptionMod,
    };
  }

  public receivePlayerData(clientShip: Ship) {
    const serialized = clientShip.torpedoDefense.serialize();

    const schema = Yup.object().shape({
      minHitChangeLowPriority: Yup.number().positive().integer().required(),
      minHitChangeMediumPriority: Yup.number().positive().integer().required(),
      minHitChangeHighPriority: Yup.number().positive().integer().required(),
      otherShipInterceptionMod: Yup.number().integer().required(),
    });

    if (!schema.isValidSync(serialized)) {
      throw new Error("Invalid ship torpedo defense");
    }

    this.deserialize(serialized);
  }

  public canIntercept(
    interceptionPriority: InterceptionPriority,
    targetsThisShip: boolean,
    hitChance: number
  ): boolean {
    let minHitChange = 0;

    switch (interceptionPriority) {
      case InterceptionPriority.LOW:
        minHitChange = this.minHitChangeLowPriority;
        break;
      case InterceptionPriority.MEDIUM:
        minHitChange = this.minHitChangeMediumPriority;
        break;
      case InterceptionPriority.HIGH:
        minHitChange = this.minHitChangeHighPriority;
        break;
    }

    if (!targetsThisShip) {
      minHitChange += this.otherShipInterceptionMod;
    }

    return hitChance >= minHitChange;
  }
}
