import hexagon from "../hexagon/index.mjs";
import uuidv4 from "uuid/v4.js";

class GameSlot {
  constructor(data = {}, gameData) {
    this.id = uuidv4();
    this.gameData = gameData;
    this.deserialize(data);
  }

  getShips() {
    if (!this.gameData) {
      return [];
    }

    return this.gameData.ships
      .getShips()
      .filter(ship => this.shipIds.includes(ship.id));
  }

  includesShip(ship) {
    return this.shipIds.includes(ship.id);
  }

  isUsers(user) {
    return this.userId === user.id;
  }

  addShip(ship) {
    this.shipIds.push(ship.id);
  }

  isTaken() {
    return Boolean(this.userId);
  }

  takeSlot(user) {
    this.userId = user.id;
  }

  leaveSlot(user) {
    if (this.userId !== user.id) {
      throw Error("Trying to leave slot that is not occupied by player");
    }

    this.userId = null;
  }

  isOccupiedBy(user) {
    return user && this.userId === user.id;
  }

  setBought() {
    this.bought = true;
  }

  isBought() {
    return this.bought;
  }

  validate() {
    if (!this.name) {
      return "Slot needs to have a name";
    }

    if (!(this.deploymentLocation instanceof hexagon.Offset)) {
      return "Slot needs to have deploymentlocation of type hexagon.Offset";
    }

    if (
      this.deploymentRadius !== parseInt(this.deploymentRadius, 10) ||
      this.deploymentRadius < 0
    ) {
      return "Slot needs to have greater than zero deploymentRadius";
    }

    if (this.team !== parseInt(this.team, 10) || this.team < 0) {
      return "Slot needs to have greater than zero numeric team";
    }

    if (!(this.deploymentVector instanceof hexagon.Offset)) {
      return "Slot needs to have deploymentVector of type hexagon.Offset";
    }

    if (this.points !== parseInt(this.points, 10) || this.points <= 0) {
      return "Slot needs to have points more than 0";
    }
  }

  isValidShipDeployment(ship, hex) {
    return (
      this.includesShip(ship) &&
      hex.distanceTo(this.deploymentLocation) <= this.deploymentRadius
    );
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      userId: this.userId,
      deploymentLocation: this.deploymentLocation,
      deploymentRadius: this.deploymentRadius,
      deploymentVector: this.deploymentVector,
      points: this.points,
      shipIds: this.shipIds,
      team: this.team,
      bought: this.bought,
      facing: this.facing
    };
  }

  deserialize(data = {}) {
    this.id = data.id || this.id;
    this.name = data.name;
    this.userId = data.userId || null;
    this.deploymentLocation = data.deploymentLocation
      ? new hexagon.Offset(data.deploymentLocation)
      : new hexagon.Offset(0, 0);
    this.deploymentVector = data.deploymentVector
      ? new hexagon.Offset(data.deploymentVector)
      : new hexagon.Offset(0, 0);
    this.deploymentRadius = data.deploymentRadius || 10;
    //this.deploymentRadius = 10000;
    this.shipIds = data.shipIds || [];
    this.points = data.points || 0;
    this.bought = data.bought || false;
    this.team = data.team || 1;
    this.facing = data.facing || 0;

    return this;
  }
}

export default GameSlot;
