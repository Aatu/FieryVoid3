import { v4 as uuidv4 } from "uuid";
import ShipSystems from "./ShipSystems";
import ShipElectronicWarfare from "./ShipElectronicWarfare";
import ShipPlayer from "./ShipPlayer";
import ShipMovement from "./ShipMovement";
import { getCompassHeadingOfPoint, addToDirection, hexFacingToAngle, } from "../utils/math";
import coordinateConverter from "../utils/CoordinateConverter";
import { SYSTEM_HANDLERS } from "./system/strategy/types/SystemHandlersTypes";
import { ShipTorpedoDefense, } from "./ShipTorpedoDefense";
import { ShipCargo } from "./ShipCargo";
class Ship {
    id = uuidv4();
    name = null;
    systems;
    pointCost;
    accelcost;
    rollcost;
    pivotcost;
    maxPivots;
    evasioncost;
    frontHitProfile;
    sideHitProfile;
    shipTypeName;
    shipClass;
    gameId = null;
    slotId = null;
    player;
    movement;
    electronicWarfare;
    destroyedThisTurn;
    aiRole = null;
    shipModel = null;
    description = "";
    torpedoDefense = new ShipTorpedoDefense();
    shipCargo = new ShipCargo(this);
    constructor(data) {
        this.systems = new ShipSystems(this);
        this.pointCost = 0;
        this.accelcost = 1;
        this.rollcost = 1;
        this.pivotcost = 1;
        this.maxPivots = null;
        this.evasioncost = 1;
        this.frontHitProfile = 30;
        this.sideHitProfile = 50;
        this.shipModel = null;
        this.shipTypeName = "";
        this.player = new ShipPlayer();
        this.setShipProperties();
        this.deserialize(data);
    }
    getId() {
        if (!this.id) {
            throw new Error("ship has no Id");
        }
        return this.id;
    }
    getAIRole() {
        if (!this.aiRole) {
            throw new Error("ship has no ai role");
        }
        return this.aiRole;
    }
    setShipProperties() { }
    getFrontHitProfile() {
        return (this.frontHitProfile +
            this.systems
                .callAllSystemHandlers(SYSTEM_HANDLERS.getHitProfile, {
                front: true,
            })
                .reduce((total, entry) => total + entry, 0));
    }
    getSideHitProfile() {
        return (this.sideHitProfile +
            this.systems
                .callAllSystemHandlers(SYSTEM_HANDLERS.getHitProfile, {
                front: false,
            })
                .reduce((total, entry) => total + entry, 0));
    }
    getHitProfile(position) {
        const heading = addToDirection(getCompassHeadingOfPoint(this.getPosition(), position), -hexFacingToAngle(this.getFacing()));
        if (heading >= 330 || heading <= 30 || (heading >= 150 && heading <= 210)) {
            return this.getFrontHitProfile();
        }
        else {
            return this.getSideHitProfile();
        }
    }
    getPointCost() {
        return this.pointCost;
    }
    getFacing() {
        const lastMove = this.movement.getLastEndMoveOrSurrogate();
        if (!lastMove) {
            throw new Error("ship has no facing");
        }
        return lastMove.getFacing();
    }
    getPosition() {
        const lastMove = this.movement.getLastEndMoveOrSurrogate();
        if (!lastMove) {
            throw new Error("ship has no position");
        }
        return lastMove.getPosition();
    }
    getHexPosition() {
        return coordinateConverter.fromGameToHex(this.getPosition());
    }
    distanceTo(target) {
        return this.getPosition().distanceTo(target.getPosition());
    }
    hexDistanceTo(target) {
        return this.getHexPosition().distanceTo(target.getHexPosition());
    }
    getVelocity() {
        const lastMove = this.movement.getLastEndMoveOrSurrogate();
        if (!lastMove) {
            return null;
        }
        return lastMove.getVelocity();
    }
    deserialize(data) {
        const shipData = data?.shipData || {};
        this.id = data?.id || uuidv4();
        this.name = data?.name || "Unnamed ship ";
        this.shipClass = this.constructor.name;
        this.slotId = data?.slotId || null;
        this.systems.deserialize(shipData.systems);
        shipData.player ? this.player.deserialize(shipData.player) : null;
        this.movement = new ShipMovement(this).deserialize(data?.movement);
        this.electronicWarfare = new ShipElectronicWarfare(this).deserialize(shipData.electronicWarfare);
        this.destroyedThisTurn = shipData.destroyedThisTurn || false;
        this.torpedoDefense.deserialize(shipData.torpedoDefense);
        this.aiRole = shipData.aiRole || null;
        return this;
    }
    serialize() {
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
                aiRole: this.aiRole && this.aiRole.serialize
                    ? this.aiRole.serialize()
                    : this.aiRole,
                torpedoDefense: this.torpedoDefense.serialize(),
            },
        };
    }
    getPlayer() {
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
    censorForUser(user, mine, turn) {
        if (!mine) {
            this.movement.removeMovementExceptEnd(turn);
        }
        this.systems.censorForUser(user, mine);
    }
    endTurn(turn) {
        this.systems.endTurn(turn);
    }
    advanceTurn(gameData) {
        const turn = gameData.turn;
        this.movement.removeMovementForOtherTurns(turn);
        this.systems.advanceTurn(turn);
        this.electronicWarfare.activatePlannedElectronicWarfare();
        this.electronicWarfare.removeAll();
        return this;
    }
    getRequiredPhasesForReceivingPlayerData() {
        return this.systems.getRequiredPhasesForReceivingPlayerData();
    }
    receivePlayerData(clientShip, gameData, phase) {
        this.systems.receivePlayerData(clientShip, gameData, phase);
        this.torpedoDefense.receivePlayerData(clientShip);
    }
    setShipLoadout() {
        this.systems.callAllSystemHandlers(SYSTEM_HANDLERS.onGameStart, undefined);
        this.systems.callAllSystemHandlers(SYSTEM_HANDLERS.setMaxFuel, undefined);
    }
    getName() {
        return this.name || "";
    }
}
export default Ship;
