import { CargoEntry } from "../cargo/CargoEntry";
import { CargoMove, SerializedCargoMove } from "../cargo/CargoMove";
import Ship from "./Ship";
import ShipSystem from "./system/ShipSystem";

export class ShipCargo {
  private ship: Ship;
  private cargoMoves: CargoMove[] = [];

  constructor(ship: Ship) {
    this.ship = ship;
  }

  public canMove(
    from: ShipSystem,
    to: ShipSystem,
    cargo: CargoEntry | CargoEntry[],
    cargoMove?: CargoMove
  ) {
    if (!from.handlers.isCargoBay() || !to.handlers.isCargoBay()) {
      return false;
    }

    if (!this.systemhasCargoSpaceFor(to, cargo, cargoMove)) {
      return false;
    }

    if (from.isDestroyed() || to.isDestroyed()) {
      return false;
    }

    if (!from.handlers.hasCargo(cargo)) {
      return false;
    }

    return true;
  }

  public moveCargo(
    from: ShipSystem,
    to: ShipSystem,
    cargo: CargoEntry | CargoEntry[]
  ) {
    if (!this.canMove(from, to, cargo)) {
      throw new Error("Invalid cargo move");
    }

    const time = to.handlers.getTimeToMoveCargoTo();

    cargo = ([] as CargoEntry[]).concat(cargo);
    this.cargoMoves.push(new CargoMove(from, to, cargo, time));
  }

  public advanceTurn() {
    this.cargoMoves.forEach((m) => m.advanceTurn());

    this.cargoMoves.filter((move) => {
      if (move.isReady()) {
        this.executeMove(move);
        return false;
      }

      if (!this.canMove(move.from, move.to, move.cargoToMove, move)) {
        this.cancelMove(move);
      }
    });
  }

  public serialize() {
    return this.cargoMoves.map((m) => m.serialize());
  }

  public deserialize(data: SerializedCargoMove[]) {
    this.cargoMoves = data.map((m) => CargoMove.deserialize(m, this.ship));
  }

  private executeMove(move: CargoMove) {}

  private cancelMove(move: CargoMove) {}

  private getTransfersTo(system: ShipSystem) {
    return this.cargoMoves.filter((move) => move.to === system);
  }

  private systemhasCargoSpaceFor(
    system: ShipSystem,
    entry: CargoEntry[] | CargoEntry,
    cargoMove?: CargoMove
  ) {
    if (system.isDestroyed()) {
      return false;
    }

    const spaceRequired = ([] as CargoEntry[])
      .concat(entry)
      .reduce(
        (total, { object, amount }) =>
          total + object.getSpaceRequired() * amount,
        0
      );

    const spaceReserved = this.getTransfersTo(system)
      .filter((move) => !cargoMove || move.id !== cargoMove.id)
      .reduce((total, move) => total + move.getTotalSpaceRequired(), 0);

    return (
      system.handlers.getAvailableCargoSpace() - spaceReserved >= spaceRequired
    );
  }

  public loadAllTargetCargoInstant() {
    this.ship.systems.getSystems().forEach((system) => {
      system.handlers.loadTargetCargoInstant();
    });
  }
}
