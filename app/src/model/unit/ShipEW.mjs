/* this class will manage the output and usage of ship systems generating EW
 */

class ShipEW {
  constructor(ship) {
    this.ship = ship;
  }

  getOffensiveEW(ship, target, type) {
    throw new Error("This has reference to gamedata");
    /*
    type = type || "OEW";

    for (var i in ship.EW) {
      var entry = ship.EW[i];
      if (entry.type === type && entry.targetid === target.id)
        return entry.amount;
    }

    return 0;
    */
  }
}

export default ShipEW;
