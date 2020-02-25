import * as THREE from "three";
import AnimationUiStrategy from "./AnimationUiStrategy";
import { getCompassHeadingOfPoint } from "../../../../../model/utils/math.mjs";
import { getSeededRandomGenerator } from "../../../../../model/utils/math.mjs";
import Vector from "../../../../../model/utils/Vector.mjs";
import MovementService from "../../../../../model/movement/MovementService.mjs";
import Line from "../../renderer/Line";
import { HexagonSprite } from "../../renderer/sprite";
import { COLOR_FRIENDLY } from "../../../../../model/gameConfig.mjs";
import { COLOR_ENEMY } from "../../../../../model/gameConfig.mjs";
import Sprite from "../../renderer/sprite/Sprite";
import HexagonMath from "../../../../../model/utils/HexagonMath.mjs";

const TEXTURE = new THREE.TextureLoader().load("/img/torpedoMarker.png");

class ShowTorpedoObjects extends AnimationUiStrategy {
  constructor() {
    super();
    this.movementService = new MovementService();
    this.lines = [];
    this.hexes = [];
    this.zoom = 1;
  }

  markHexes(gameData) {
    const hexPositions = [];
    const { scene, currentUser } = this.services;
    gameData.torpedos.getTorpedoFlights().forEach(flight => {
      const hexPosition = flight.strikePosition.toOffset();
      const target = gameData.ships.getShipById(flight.targetId);
      const spriteFacing = getCompassHeadingOfPoint(
        flight.strikePosition,
        target.movement.getLastEndMoveOrSurrogate().position
      );

      if (
        !hexPositions.find(
          ({ position, target, facing }) =>
            position.equals(hexPosition) &&
            target === target &&
            facing === spriteFacing
        )
      ) {
        hexPositions.push({
          position: hexPosition,
          target: target,
          facing: spriteFacing
        });
      }
    });

    hexPositions.forEach(({ position, target, facing }) => {
      const pos = position.toVector();
      const color = gameData.slots.isShipInUsersTeam(currentUser, target)
        ? COLOR_ENEMY
        : COLOR_FRIENDLY;

      if (
        !this.hexes.find(
          hex => hex.isPosition(pos) && hex.isOverlayColor(color)
        )
      ) {
        const sprite = new Sprite(
          TEXTURE,
          {
            width: HexagonMath.getTextureWidth() * 0.8,
            height: HexagonMath.getTextureHeight() * 0.8
          },
          0
        )
          .setPosition(pos)
          .setOpacity(0.5)
          .setOverlayColorAlpha(1)
          .setOverlayColor(color)
          .setFacing(-facing)
          .show();
        this.hexes.push(sprite);
        scene.add(sprite.mesh);
      }
    });

    this.hexes = this.hexes.filter(sprite => {
      if (
        !hexPositions.find(({ position }) =>
          sprite.isPosition(position.toVector())
        )
      ) {
        scene.remove(sprite.mesh);
        return false;
      }

      return true;
    });
  }

  update(gameData) {
    super.update(gameData);

    gameData.torpedos.getTorpedoFlights().forEach(flight => {
      const target = gameData.ships.getShipById(flight.targetId);
      this.handleImpactingTorpedo(flight, target);
    });

    this.markHexes(gameData);
  }

  shipStateChanged(ship) {
    if (!this.gameData) {
      return;
    }

    this.gameData.torpedos
      .getTorpedoFlights()
      .filter(flight => flight.targetId === ship.id)
      .forEach(flight => {
        this.handleImpactingTorpedo(flight, ship);
      });

    this.markHexes(this.gameData);
  }

  handleImpactingTorpedo(flight, target) {
    const { torpedoIconContainer, scene, shipIconContainer } = this.services;

    const icon = torpedoIconContainer.getIconByTorpedoFlight(flight);
    const getRandom = getSeededRandomGenerator(icon.torpedoFlight.id);
    const variance = new Vector(
      getRandom() * 25 - 12.5,
      getRandom() * 25 - 12.5,
      getRandom() * 10 - 5
    );

    const targetPosition = target.movement.getLastEndMoveOrSurrogate().position;

    const torpedoPosition = flight.strikePosition
      .setZ(shipIconContainer.getByShip(target).shipZ)
      .add(variance);

    icon.setPosition(torpedoPosition);
    icon.setFacing(-getCompassHeadingOfPoint(torpedoPosition, targetPosition));

    let line = this.lines.find(
      ({ flightId, targetId }) =>
        flightId === flight.id && targetId === target.id
    );

    if (!line) {
      line = new Line(scene, {
        start: torpedoPosition,
        end: targetPosition.setZ(shipIconContainer.getByShip(target).shipZ),
        width: 2,
        color: new THREE.Color(255 / 255, 40 / 255, 40 / 255),
        opacity: 0.01,
        pulseAmount: 1
      });
      line.show();
      this.lines.push({
        targetId: target.id,
        flightId: flight.id,
        line
      });
    } else {
      line.line.update(
        torpedoPosition,
        targetPosition.setZ(shipIconContainer.getByShip(target).shipZ),
        2
      );
    }

    icon.show();
  }

  deactivate() {
    const { torpedoIconContainer, scene } = this.services;
    torpedoIconContainer.getArray().forEach(icon => {
      icon.hide();
    }, this);

    this.lines.forEach(line => line.line.destroy());
    this.hexes.forEach(sprite => scene.remove(sprite.mesh));
    return super.deactivate();
  }

  render({ zoom }) {
    if (zoom === this.zoom) {
      return;
    }

    this.zoom = zoom;

    if (zoom > 1) {
      this.hexes.forEach(sprite => {
        sprite.setScale(zoom * 0.8, zoom * 0.8);
      });
    } else {
      this.hexes.forEach(sprite => {
        sprite.setScale(1, 1);
      });
    }
  }
}

export default ShowTorpedoObjects;
