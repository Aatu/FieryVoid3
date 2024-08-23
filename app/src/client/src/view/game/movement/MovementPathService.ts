import { User } from "@fieryvoid3/model";
import ShipIconContainer from "../renderer/icon/ShipIconContainer";
import MovementPath from "./MovementPath";
import * as THREE from "three";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import ShipObject from "../renderer/ships/ShipObject";
import GameData from "@fieryvoid3/model/src/game/GameData";

type Path = {
  ship: Ship;
  ghost: ShipObject;
  movementPath: MovementPath | null;
};

class MovementPathService {
  private scene: THREE.Object3D;
  private shipIconContainer: ShipIconContainer;
  private currentUser: User | null;
  private paths: Path[];

  constructor(
    scene: THREE.Object3D,
    shipIconContainer: ShipIconContainer,
    currentUser: User | null
  ) {
    this.scene = scene;
    this.shipIconContainer = shipIconContainer;
    this.currentUser = currentUser;

    this.paths = [];
  }

  getPath(ship: Ship) {
    return this.paths.find((path) => path.ship.id === ship.id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(gameData: GameData) {}

  hideAllMovementPaths() {
    this.paths.forEach((path) => path.movementPath?.remove());
    this.paths = [];
  }

  hideMovementPath(ship: Ship) {
    const path = this.getPath(ship);
    if (!path) {
      return;
    }

    path.movementPath?.remove();
    this.paths = this.paths.filter(
      (path) => path.ship.getId() !== ship.getId()
    );
  }

  showMovementPath(ship: Ship) {
    let path = this.getPath(ship);

    if (!path) {
      path = {
        ship,
        ghost: this.shipIconContainer.getGhostShipIconByShip(ship),
        movementPath: null,
      };
      this.paths.push(path);
    } else {
      path.ship = ship;
    }

    if (path.movementPath) {
      //TODO: this is inefficient and causes flickering
      //path.movementPath.remove(this.scene);
      path.movementPath.update(ship);
    } else {
      path.movementPath = new MovementPath(
        ship,
        this.scene,
        path.ghost,
        ship.player.is(this.currentUser)
      );
    }
  }
}

export default MovementPathService;
