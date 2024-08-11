import { v4 as uuidv4 } from "uuid";
import ShipSystems, { SerializedShipSystems } from "./ShipSystems";
import ShipElectronicWarfare from "./ShipElectronicWarfare";
import ShipPlayer from "./ShipPlayer";
import ShipMovement from "./ShipMovement.js";
import {
  getCompassHeadingOfPoint,
  addToDirection,
  hexFacingToAngle,
} from "../utils/math.js";
import coordinateConverter from "../utils/CoordinateConverter";
import { IHexPosition, Offset } from "../hexagon/index";
import Vector, { IVector } from "../utils/Vector";
import { IUser, User } from "../User/User.js";
import { SearializedShipCurrentElectronicWarfare } from "./ShipCurrentElectronicWarfare";
import { SYSTEM_HANDLERS } from "./system/strategy/types/SystemHandlersTypes";
import { SerializedMovementOrder } from "../movement/MovementOrder";
import GameData from "../game/GameData";
import { AiRole } from "../ai/AiRole";

export type ShipBase = {
  id?: string;
  gameId?: number | null;
  name?: string | null;
  shipClass?: string;
  slotId?: string | null;
};

export type ShipData = {
  systems?: SerializedShipSystems;
  player?: IUser | null;
  electronicWarfare?: SearializedShipCurrentElectronicWarfare;
  destroyedThisTurn?: boolean;
  aiRole?: any | null;
};

export type SerializedShip = ShipBase &
  ShipData & { movement: SerializedMovementOrder[]; shipData?: ShipData };

class Ship implements IHexPosition {
  public id: string = uuidv4();
  public name: string | null = null;
  public systems: ShipSystems;
  public pointCost: number;
  public accelcost: number;
  public rollcost: number;
  public pivotcost: number;
  public maxPivots: number | null;
  public evasioncost: number;
  public frontHitProfile: number;
  public sideHitProfile: number;
  public hexSizes: Offset[];
  public shipTypeName: string;
  public shipClass!: string;
  public gameId: number | null = null;
  public slotId: string | null = null;
  public player: ShipPlayer | null = null;
  public movement!: ShipMovement;
  public electronicWarfare!: ShipElectronicWarfare;
  public destroyedThisTurn!: boolean;
  public aiRole: AiRole | null = null;
  public shipModel: unknown | null = null;
  public description: string = "";

  constructor(data?: SerializedShip | ShipBase) {
    this.systems = new ShipSystems(this);
    this.pointCost = 0;
    this.accelcost = 1;
    this.rollcost = 1;
    this.pivotcost = 1;
    this.maxPivots = null;
    this.evasioncost = 1;
    this.frontHitProfile = 30;
    this.sideHitProfile = 50;
    this.hexSizes = [];

    this.shipModel = null;
    this.shipTypeName = "";
    this.setShipProperties();
    this.deserialize(data);
  }

  getId(): string {
    if (!this.id) {
      throw new Error("ship has no Id");
    }

    return this.id;
  }

  getAIRole(): AiRole {
    if (!this.aiRole) {
      throw new Error("ship has no ai role");
    }

    return this.aiRole;
  }

  setShipProperties() {}

  getFrontHitProfile() {
    return (
      this.frontHitProfile +
      this.systems
        .callAllSystemHandlers<number>(SYSTEM_HANDLERS.getHitProfile, {
          front: true,
        })
        .reduce((total, entry) => total + entry, 0)
    );
  }

  getSideHitProfile() {
    return (
      this.sideHitProfile +
      this.systems
        .callAllSystemHandlers<number>(SYSTEM_HANDLERS.getHitProfile, {
          front: false,
        })
        .reduce((total, entry) => total + entry, 0)
    );
  }

  getHitProfile(position: IVector) {
    const heading = addToDirection(
      getCompassHeadingOfPoint(this.getPosition(), position),
      -hexFacingToAngle(this.getFacing())
    );

    if (heading >= 330 || heading <= 30 || (heading >= 150 && heading <= 210)) {
      return this.getFrontHitProfile();
    } else {
      return this.getSideHitProfile();
    }
  }

  getPointCost() {
    return this.pointCost;
  }

  getFacing(): number {
    const lastMove = this.movement.getLastEndMoveOrSurrogate();
    if (!lastMove) {
      throw new Error("ship has no facing");
    }

    return lastMove.getFacing();
  }

  getPosition(): Vector {
    const lastMove = this.movement.getLastEndMoveOrSurrogate();
    if (!lastMove) {
      throw new Error("ship has no position");
    }

    return lastMove.getPosition();
  }

  getHexPosition() {
    return coordinateConverter.fromGameToHex(this.getPosition());
  }

  distanceTo(target: Ship) {
    return this.getPosition().distanceTo(target.getPosition());
  }

  hexDistanceTo(target: Ship) {
    return this.getHexPosition().distanceTo(target.getHexPosition());
  }

  getVelocity() {
    const lastMove = this.movement.getLastEndMoveOrSurrogate();
    if (!lastMove) {
      return null;
    }

    return lastMove.getVelocity();
  }

  getIconHexas(hexFacing = 0) {
    return this.hexSizes.map((hex) => hex.rotate(hexFacing));
  }

  deserialize(data?: SerializedShip | ShipBase | undefined): Ship {
    const shipData = (data as SerializedShip)?.shipData || {};
    this.id = data?.id || uuidv4();
    this.name = data?.name || "Unnamed ship ";
    this.shipClass = this.constructor.name;
    this.slotId = data?.slotId || null;

    this.systems.deserialize(shipData.systems);
    this.player = shipData.player
      ? new ShipPlayer().deserialize(shipData.player)
      : null;
    this.movement = new ShipMovement(this).deserialize(
      (data as SerializedShip)?.movement
    );
    this.electronicWarfare = new ShipElectronicWarfare(this).deserialize(
      shipData.electronicWarfare
    );
    this.destroyedThisTurn = shipData.destroyedThisTurn || false;

    this.aiRole = shipData.aiRole || null;

    return this;
  }

  serialize(): SerializedShip {
    /*
    NOTE: shipData gets serialized normally. Everything else has custom handling
    If you want to serialize something, serialize it inside of shipData
    (This is like the fifth time I am wondering why stuff doesnt get serialized:P)  
    */
    return {
      id: this.id,
      gameId: this.gameId,
      name: this.name,
      shipClass: this.shipClass,
      slotId: this.slotId,
      movement: this.movement.serialize(),
      shipData: {
        systems: this.systems.serialize(),
        player: this.player?.serialize() || null,
        electronicWarfare: this.electronicWarfare.serialize(),
        destroyedThisTurn: this.destroyedThisTurn,
        aiRole:
          this.aiRole && this.aiRole.serialize
            ? this.aiRole.serialize()
            : this.aiRole,
      },
    };
  }

  getPlayer(): ShipPlayer {
    if (!this.player) {
      throw new Error("ship has no player");
    }

    return this.player;
  }

  isDestroyed() {
    return this.systems.isDestroyed();
  }

  isDestroyedThisTurn() {
    return this.destroyedThisTurn;
  }

  markDestroyedThisTurn() {
    this.destroyedThisTurn = true;
  }

  censorForUser(user: User | null, mine: boolean, turn: number) {
    if (!mine) {
      this.movement.removeMovementExceptEnd(turn);
    }
    this.systems.censorForUser(user, mine);
  }

  endTurn(turn: number) {
    this.systems.endTurn(turn);
  }

  advanceTurn(turn: number) {
    this.movement.removeMovementForOtherTurns(turn);
    this.systems.advanceTurn(turn);
    this.electronicWarfare.activatePlannedElectronicWarfare();
    this.electronicWarfare.removeAll();

    return this;
  }

  getRequiredPhasesForReceivingPlayerData() {
    return this.systems.getRequiredPhasesForReceivingPlayerData();
  }

  receivePlayerData(clientShip: Ship, gameData: GameData, phase: number) {
    this.systems.receivePlayerData(clientShip, gameData, phase);
  }

  setShipLoadout() {
    this.systems.callAllSystemHandlers(SYSTEM_HANDLERS.onGameStart, undefined);
    this.systems.callAllSystemHandlers(
      SYSTEM_HANDLERS.loadTargetInstant,
      undefined
    );
    this.systems.callAllSystemHandlers(SYSTEM_HANDLERS.setMaxFuel, undefined);
  }
}

export default Ship;
