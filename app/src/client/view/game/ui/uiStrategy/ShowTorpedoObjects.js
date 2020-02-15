import * as THREE from "three";
import AnimationUiStrategy from "./AnimationUiStrategy";
import { getCompassHeadingOfPoint } from "../../../../../model/utils/math.mjs";
import { getSeededRandomGenerator } from "../../../../../model/utils/math.mjs";
import Vector from "../../../../../model/utils/Vector.mjs";
import { TORPEDO_Z } from "../../../../../model/gameConfig.mjs";
import TorpedoMovementService from "../../../../../model/movement/TorpedoMovementService.mjs";
import MovementService from "../../../../../model/movement/MovementService.mjs";
import Line from "../../renderer/Line";

class ShowTorpedoObjects extends AnimationUiStrategy {
  constructor() {
    super();
    this.torpedoMovementService = new TorpedoMovementService();
    this.movementService = new MovementService();
    this.lines = [];
  }

  update(gameData) {
    super.update(gameData);

    gameData.torpedos.getTorpedoFlights().forEach(flight => {
      const target = gameData.ships.getShipById(flight.targetId);
      if (this.torpedoMovementService.reachesTargetThisTurn(flight, target)) {
        this.handleImpactingTorpedo(flight, target);
        return;
      } else {
        this.handleTorpedo(flight);
      }
    });
  }

  shipStateChanged(ship) {
    if (!this.gameData) {
      return;
    }

    this.gameData.torpedos
      .getTorpedoFlights()
      .filter(flight => flight.targetId === ship.id)
      .forEach(flight => {
        if (this.torpedoMovementService.reachesTargetThisTurn(flight, ship)) {
          this.handleImpactingTorpedo(flight, ship);
        }
      });
  }

  handleImpactingTorpedo(flight, target) {
    const { torpedoIconContainer, scene, shipIconContainer } = this.services;

    const icon = torpedoIconContainer.getIconByTorpedoFlight(flight);
    const getRandom = getSeededRandomGenerator(icon.torpedoFlight.id);
    const variance = new Vector(getRandom() * 100 - 50, getRandom() * 100 - 50);

    const launchPosition = flight.launchPosition;
    const targetPosition = target.movement.getLastEndMoveOrSurrogate().position;

    const torpedoPosition = launchPosition
      .sub(targetPosition)
      .normalize()
      .multiplyScalar(500)
      .add(targetPosition)
      .setZ(TORPEDO_Z)
      .add(variance);

    icon.setPosition(torpedoPosition);
    icon.setFacing(
      -getCompassHeadingOfPoint(
        flight.position,
        flight.position.add(flight.velocity)
      )
    );

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

  handleTorpedo(flight) {
    const { torpedoIconContainer } = this.services;

    const icon = torpedoIconContainer.getIconByTorpedoFlight(flight);

    const getRandom = getSeededRandomGenerator(icon.torpedoFlight.id);
    const variance = new Vector(getRandom() * 30 - 15, getRandom() * 30 - 15);

    icon.setPosition(flight.position.setZ(TORPEDO_Z).add(variance));
    icon.setFacing(
      -getCompassHeadingOfPoint(
        flight.position,
        flight.position.add(flight.velocity)
      )
    );

    icon.show();
  }

  deactivate() {
    const { torpedoIconContainer } = this.services;
    torpedoIconContainer.getArray().forEach(icon => {
      icon.hide();
    }, this);

    this.lines.forEach(line => line.line.destroy());
    return super.deactivate();
  }
}

export default ShowTorpedoObjects;
