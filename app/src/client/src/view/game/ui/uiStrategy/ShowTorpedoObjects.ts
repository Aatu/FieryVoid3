import * as THREE from "three";
import AnimationUiStrategy from "./AnimationUiStrategy";
import {
  COLOR_ENEMY,
  COLOR_FRIENDLY,
} from "@fieryvoid3/model/src/config/gameConfig";
import HexagonMath from "@fieryvoid3/model/src/utils/HexagonMath";
import {
  getCompassHeadingOfPoint,
  getSeededRandomGenerator,
} from "@fieryvoid3/model/src/utils/math";
import Vector from "@fieryvoid3/model/src/utils/Vector";
import { HexagonSprite } from "../../renderer/sprite";
import GameData from "@fieryvoid3/model/src/game/GameData";
import { Offset } from "@fieryvoid3/model/src/hexagon";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import Sprite from "../../renderer/sprite/Sprite";
import TorpedoFlight from "@fieryvoid3/model/src/unit/TorpedoFlight";
import Line from "../../renderer/Line";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";

const TEXTURE = new THREE.TextureLoader().load("/img/torpedoMarker.png");

class ShowTorpedoObjects extends AnimationUiStrategy {
  private lines: { targetId: string; flightId: string; line: Line }[] = [];
  private hexes: HexagonSprite[] = [];
  private zoom: number = 1;

  markHexes(gameData: GameData) {
    const hexPositions: { position: Offset; target: Ship; facing: number }[] =
      [];

    const { scene, currentUser } = this.getServices();
    gameData.torpedos.getTorpedoFlights().forEach((flight) => {
      const hexPosition = flight.strikePosition.toOffset();
      const torpedoTarget = gameData.ships.getShipById(flight.targetId);
      const spriteFacing = getCompassHeadingOfPoint(
        flight.strikePosition,
        torpedoTarget.movement.getLastEndMoveOrSurrogate().position
      );

      if (
        !hexPositions.find(
          ({ position, target, facing }) =>
            position.equals(hexPosition) &&
            target === torpedoTarget &&
            facing === spriteFacing
        )
      ) {
        hexPositions.push({
          position: hexPosition,
          target: torpedoTarget,
          facing: spriteFacing,
        });
      }
    });

    hexPositions.forEach(({ position, target, facing }) => {
      const pos = position.toVector();
      const color =
        currentUser && gameData.slots.isShipInUsersTeam(currentUser, target)
          ? COLOR_FRIENDLY
          : COLOR_ENEMY;

      if (
        !this.hexes.find(
          (hex) => hex.isPosition(pos) && hex.isOverlayColor(color)
        )
      ) {
        const sprite = new Sprite(
          TEXTURE,
          {
            width: HexagonMath.getTextureWidth() * 0.8,
            height: HexagonMath.getTextureHeight() * 0.8,
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
        scene.add(sprite.getMesh());
      }
    });

    this.hexes = this.hexes.filter((sprite) => {
      if (
        !hexPositions.find(({ position }) =>
          sprite.isPosition(position.toVector())
        )
      ) {
        scene.remove(sprite.getMesh());
        return false;
      }

      return true;
    });
  }

  update(gameData: GameData) {
    super.update(gameData);

    gameData.torpedos.getTorpedoFlights().forEach((flight) => {
      const target = gameData.ships.getShipById(flight.targetId);
      this.handleImpactingTorpedo(flight, target);
    });

    this.markHexes(gameData);
  }

  shipStateChanged({ ship }: { ship: Ship }) {
    if (!this.gameData) {
      return;
    }

    this.gameData.torpedos
      .getTorpedoFlights()
      .filter((flight) => flight.targetId === ship.id)
      .forEach((flight) => {
        this.handleImpactingTorpedo(flight, ship);
      });

    this.markHexes(this.gameData);
  }

  handleImpactingTorpedo(flight: TorpedoFlight, target: Ship) {
    const { torpedoIconContainer, scene, shipIconContainer } =
      this.getServices();

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

    const lineEntry = this.lines.find(
      ({ flightId, targetId }) =>
        flightId === flight.id && targetId === target.id
    );

    if (!lineEntry) {
      const line = new Line(scene, {
        start: torpedoPosition,
        end: targetPosition.setZ(shipIconContainer.getByShip(target).shipZ),
        width: 2,
        color: new THREE.Color(255 / 255, 40 / 255, 40 / 255),
        opacity: 0.01,
        pulseAmount: 1,
      });
      line.show();
      this.lines.push({
        targetId: target.id,
        flightId: flight.id,
        line,
      });
    } else {
      lineEntry.line.update(
        torpedoPosition,
        targetPosition.setZ(shipIconContainer.getByShip(target).shipZ),
        2
      );
    }

    icon.show();
  }

  deactivate() {
    const { torpedoIconContainer, scene } = this.getServices();
    torpedoIconContainer.getArray().forEach((icon) => {
      icon.hide();
    }, this);

    this.lines.forEach((line) => line.line.destroy());
    this.hexes.forEach((sprite) => scene.remove(sprite.getMesh()));
    return super.deactivate();
  }

  render({ zoom }: RenderPayload) {
    if (zoom === this.zoom) {
      return;
    }

    this.zoom = zoom;

    if (zoom > 1) {
      this.hexes.forEach((sprite) => {
        sprite.setScale(zoom * 0.8, zoom * 0.8);
      });
    } else {
      this.hexes.forEach((sprite) => {
        sprite.setScale(1, 1);
      });
    }
  }
}

export default ShowTorpedoObjects;
