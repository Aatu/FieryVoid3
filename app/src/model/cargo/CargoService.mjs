class CargoService {
  divideCargo(ship, cargo) {
    if (!this.hasSpaceFor(ship, cargo)) {
      throw new Error(
        "Ship has no cargo space for this. Check validity first!"
      );
    }
    const cargoBays = this.getBaysWithSpace(ship);

    let amount = cargo.amount;
    while (amount > 0) {
      cargoBays.forEach((system) => {
        if (
          amount > 0 &&
          system.callHandler(
            "hasSpaceFor",
            { object: cargo.object, amount: 1 },
            false
          )
        ) {
          system.callHandler("addCargo", { object: cargo.object, amount: 1 });
          amount--;
        }
      });
    }
  }

  hasSpaceForHowMany(ship, cargo) {
    const space = this.getShipWideCargoSpaceAvailable(ship);
    return Math.floor(space / cargo.object.getSpaceRequired());
  }

  hasSpaceFor(ship, cargo) {
    return (
      this.getShipWideCargoSpaceAvailable(ship) >=
      cargo.object.getSpaceRequired() * cargo.amount
    );
  }

  getShipWideCargoSpaceAvailable(ship) {
    return this.getBaysWithSpace(ship).reduce(
      (total, system) =>
        total + system.callHandler("getAvailableCargoSpace", {}, 0),
      0
    );
  }

  getBaysWithSpace(ship) {
    return ship.systems
      .getSystems()
      .filter((system) => !system.isDestroyed())
      .filter(
        (system) => system.callHandler("getAvailableCargoSpace", {}, 0) > 0
      );
  }
}

export default CargoService;
