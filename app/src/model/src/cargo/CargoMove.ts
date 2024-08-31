import Ship from "../unit/Ship";
import ShipSystem from "../unit/system/ShipSystem";
import { v4 as uuidv4 } from "uuid";
import { SerializedCargoEntry, CargoEntry } from "./CargoEntry";

export type SerializedCargoMove = {
  id: string;
  fromId: number;
  toId: number;
  cargoToMove: SerializedCargoEntry[];
  timeToMove: number;
  turnsMoved: number;
};

export class CargoMove {
  public id: string = uuidv4();
  public from: ShipSystem;
  public to: ShipSystem;
  public cargoToMove: CargoEntry[];
  public timeToMove: number;
  public turnsMoved: number = 0;

  constructor(
    from: ShipSystem,
    to: ShipSystem,
    cargoToMove: CargoEntry[],
    timeToMove: number
  ) {
    this.from = from;
    this.to = to;
    this.cargoToMove = cargoToMove;
    this.timeToMove = timeToMove;
  }

  public getTotalSpaceRequired() {
    return this.cargoToMove.reduce(
      (total, cargo) => total + cargo.object.getSpaceRequired() * cargo.amount,
      0
    );
  }

  public advanceTurn() {
    this.turnsMoved++;
  }

  public isReady(): boolean {
    return this.turnsMoved >= this.timeToMove;
  }

  public serialize(): SerializedCargoMove {
    return {
      id: this.id,
      fromId: this.from.id,
      toId: this.to.id,
      cargoToMove: this.cargoToMove.map((c) => c.serialize()),
      timeToMove: this.timeToMove,
      turnsMoved: this.turnsMoved,
    };
  }

  public static deserialize(data: SerializedCargoMove, ship: Ship): CargoMove {
    const cargo = data.cargoToMove.map((c) => CargoEntry.deserialize(c));
    const cargoMove = new CargoMove(
      ship.systems.getSystemById(data.fromId),
      ship.systems.getSystemById(data.toId),
      cargo,
      data.timeToMove
    );
    cargoMove.id = data.id;
    cargoMove.turnsMoved = data.turnsMoved;

    return cargoMove;
  }
}
