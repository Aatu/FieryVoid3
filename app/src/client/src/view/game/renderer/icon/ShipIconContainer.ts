import Ship from "@fieryvoid3/model/src/unit/Ship";
import * as shipObjects from "../ships";
import ShipObject from "../ships/ShipObject";
import * as THREE from "three";
import { User } from "@fieryvoid3/model";
import GameData from "@fieryvoid3/model/src/game/GameData";
import { CoordinateConverter } from "@fieryvoid3/model/src/utils/CoordinateConverter";
import { IVector } from "@fieryvoid3/model/src/utils/Vector";
import { distance } from "@fieryvoid3/model/src/utils/math";
import { Offset } from "@fieryvoid3/model/src/hexagon";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";

type IconMap = Record<string, ShipObject>;

const buildShipArray = (iconsAsObject: IconMap) => {
  return Object.keys(iconsAsObject).map((key) => iconsAsObject[key]);
};

const createIcon = (ship: Ship, scene: THREE.Object3D): ShipObject => {
  // @ts-expect-error dynamic class creation
  return new shipObjects[ship.shipModel](ship, scene);
};

const createGhostShipIcon = (
  ship: Ship,
  scene: THREE.Object3D,
  currentUser: User | null
): ShipObject => {
  // @ts-expect-error dynamic class creation
  const icon = new shipObjects[ship.shipModel](ship, scene);

  icon.setGhostShip(ship.player.is(currentUser));
  icon.hide();

  return icon;
};

class ShipIconContainer {
  private iconsAsObject: IconMap;
  private iconsAsArray: ShipObject[];
  private scene: THREE.Object3D;
  private currentUser: User | null;
  private ghostShipIcons: ShipObject[];
  private coordinateConverter: CoordinateConverter;

  constructor(
    scene: THREE.Object3D,
    currentUser: User | null,
    coordinateConverter: CoordinateConverter
  ) {
    this.iconsAsObject = {};
    this.iconsAsArray = [];
    this.scene = scene;
    this.currentUser = currentUser;
    this.coordinateConverter = coordinateConverter;

    this.ghostShipIcons = [];
  }

  shipsLoaded() {
    return Promise.all(this.iconsAsArray.map((icon) => icon.isLoaded.promise));
  }

  getGhostShipIconByShip(ship: Ship) {
    let icon = this.ghostShipIcons.find((icon) => icon.ship === ship);

    if (!icon) {
      icon = createGhostShipIcon(ship, this.scene, this.currentUser);
      this.ghostShipIcons.push(icon);
    }

    return icon;
  }

  update(gamedata: GameData) {
    gamedata.ships.getShips().forEach((ship) => {
      if (!this.hasIcon(ship.id)) {
        this.iconsAsObject[ship.id] = createIcon(ship, this.scene);
      } else {
        this.iconsAsObject[ship.id].consumeShipdata(ship);
      }

      const ghost = this.ghostShipIcons.find(
        (icon) => icon.ship.id === ship.id
      );
      if (ghost) {
        ghost.consumeShipdata(ship);
      }
    });

    this.iconsAsArray = buildShipArray(this.iconsAsObject);
  }

  getByShip(ship: Ship) {
    return this.iconsAsObject[ship.id];
  }

  getById(id: string) {
    return this.iconsAsObject[id];
  }

  onEvent(name: string, payload: unknown) {
    // @ts-expect-error dynamic event handling
    const target = this["on" + name];

    if (target && typeof target === "function") {
      target.call(this, payload);
    }
  }

  onZoomEvent(/* payload: { zoom: number }*/) {
    /*
    const zoom = payload.zoom;

    let alpha = zoom > 2 ? zoom - 2 : 0;

    if (alpha > 1) {
      alpha = 1;
    }

    this.iconsAsArray.forEach(function (icon) {
      icon.setOverlayColorAlpha(alpha);
    });
    */
  }

  getArray() {
    return this.iconsAsArray;
  }

  hasIcon(shipId: string) {
    return Boolean(this.iconsAsObject[shipId]);
  }

  getIconById(shipId: string) {
    return this.iconsAsObject[shipId];
  }

  getIconsInProximity(payload: { hex: Offset; game: IVector }): ShipObject[] {
    const hexHeight = this.coordinateConverter.getHexHeightViewport();
    const currentDistance = hexHeight / 10;

    let icons: ShipObject[] = [];

    if (currentDistance < 30) {
      icons = this.getIconsInSameHex(payload.hex);
    } else {
      let closest: ShipObject | null = null;
      let closestDistance: number | null = null;

      this.iconsAsArray.forEach(function (shipIcon) {
        const currentDistance = distance(shipIcon.getPosition(), payload.game);

        if (
          currentDistance < 10 &&
          (!closest || currentDistance < closestDistance!)
        ) {
          closest = shipIcon;
          closestDistance = currentDistance;
        }
      }, this);

      if (closest) icons.push(closest);
    }

    return icons;
  }

  getIconsInSameHex(hex: Offset) {
    return this.iconsAsArray.filter((shipIcon) => {
      return this.coordinateConverter
        .fromGameToHex(shipIcon.getPosition())
        .equals(hex);
    });
  }

  /*
  getFinalMovementInSameHex(hex: Offset) {
    return this.iconsAsArray.filter(function (shipIcon) {
      return (
        !shipIcon.ship.isDestroyed() &&
        shipIcon.getLastMovement().position.equals(hex)
      );
    }, this);
  }
    */

  render(renderPayload: RenderPayload) {
    this.iconsAsArray.forEach((icon) => icon.render(renderPayload));
  }
}

export default ShipIconContainer;
