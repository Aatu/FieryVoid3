import * as THREE from "three";
import { CircleSprite, LineSprite, ShipFacingSprite } from "../renderer/sprite";

class NavigationalMovementPath {
  constructor(terrain, startMove, turns, coordinateConverter, scene) {
    this.terrain = terrain;
    this.startMove = startMove;
    this.turns = turns;
    this.coordinateConverter = coordinateConverter;
    this.scene = scene;

    this.objects = [];

    this.create();
  }

  remove() {
    this.objects.forEach(object3d => {
      this.scene.remove(object3d.mesh);
      object3d.destroy();
    });
  }

  create() {
    return;
    let move = this.startMove;

    let turns = this.turns;

    this.terrain.applyGravityToMove(move, this.coordinateConverter);
    this.createLine(move.position, move.target);

    while (turns--) {
      move = move.clone();
      move.turn = move.turn + 1;
      this.terrain.applyGravityToMove(move, this.coordinateConverter);
      this.createLine(move.position, move.target);
    }
  }

  createLine(position, vector) {
    const end = position.add(vector);

    const line = new LineSprite(
      this.coordinateConverter.fromHexToGame(position),
      this.coordinateConverter.fromHexToGame(end),
      50,
      new THREE.Color(132 / 255, 165 / 255, 206 / 255),
      0.5
    );

    this.scene.add(line.mesh);
    this.objects.push(line);
  }
}

export default NavigationalMovementPath;
