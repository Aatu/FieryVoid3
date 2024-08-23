import { Offset } from "../hexagon/index";
import { v4 as uuidv4 } from "uuid";
import GameData from "./GameData";
import { IOffset } from "../hexagon/Offset";
import Ship from "../unit/Ship";
import { User } from "../User/User";

export type SerializedGameSlot = {
  id?: string;
  name?: string;
  userId?: number | null;
  deploymentLocation?: IOffset;
  deploymentRadius?: number;
  deploymentVector?: IOffset;
  points?: number;
  shipIds?: string[];
  team?: number;
  bought?: boolean;
  facing?: number;
};

class GameSlot {
  public id: string;
  public gameData: GameData;
  public shipIds: string[] = [];
  public name!: string;
  public userId: number | null = null;
  public deploymentLocation!: Offset;
  public deploymentRadius!: number;
  public deploymentVector!: Offset;
  public points!: number;
  public team!: number;
  public bought!: boolean;
  public facing!: number;

  constructor(data = {}, gameData: GameData) {
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
      .filter((ship) => this.shipIds.includes(ship.getId()));
  }

  includesShip(ship: Ship) {
    return this.shipIds.includes(ship.getId());
  }

  isUsers(user: User | null) {
    if (!user) {
      return false;
    }

    return this.userId === user.id;
  }

  addShip(ship: Ship) {
    this.shipIds.push(ship.getId());
  }

  isTaken() {
    return Boolean(this.userId);
  }

  takeSlot(user: User) {
    this.userId = user.id;
  }

  leaveSlot(user: User) {
    if (this.userId !== user.id) {
      throw Error("Trying to leave slot that is not occupied by player");
    }

    this.userId = null;
  }

  isOccupiedBy(user: User) {
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

    if (!(this.deploymentLocation instanceof Offset)) {
      return "Slot needs to have deploymentlocation of type hexagon.Offset";
    }

    if (
      this.deploymentRadius !==
        parseInt(this.deploymentRadius.toString(), 10) ||
      this.deploymentRadius < 0
    ) {
      return "Slot needs to have greater than zero deploymentRadius";
    }

    if (this.team !== parseInt(this.team.toString(), 10) || this.team < 0) {
      return "Slot needs to have greater than zero numeric team";
    }

    if (!(this.deploymentVector instanceof Offset)) {
      return "Slot needs to have deploymentVector of type hexagon.Offset";
    }

    if (
      this.points !== parseInt(this.points.toString(), 10) ||
      this.points <= 0
    ) {
      return "Slot needs to have points more than 0";
    }
  }

  isValidShipDeployment(ship: Ship, hex: Offset) {
    return (
      this.includesShip(ship) &&
      hex.distanceTo(this.deploymentLocation) <= this.deploymentRadius
    );
  }

  serialize(): SerializedGameSlot {
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
      facing: this.facing,
    };
  }

  deserialize(data: SerializedGameSlot = {}) {
    this.id = data.id || this.id;
    this.name = data.name || "";
    this.userId = data.userId || null;
    this.deploymentLocation = data.deploymentLocation
      ? new Offset(data.deploymentLocation)
      : new Offset(0, 0);
    this.deploymentVector = data.deploymentVector
      ? new Offset(data.deploymentVector)
      : new Offset(0, 0);
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
