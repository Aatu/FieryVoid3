import * as THREE from "three";
import { LineSprite } from "../renderer/sprite";
import GameTerrain from "@fieryvoid3/model/src/game/GameTerrain";
import Vector from "@fieryvoid3/model/src/utils/Vector";
import { CoordinateConverter } from "@fieryvoid3/model/src/utils/CoordinateConverter";

class NavigationalMovementPath {
  private terrain: GameTerrain;
  private position: Vector;
  private velocity: Vector;
  private turns: number;
  private coordinateConverter: CoordinateConverter;
  private scene: THREE.Object3D;
  private objects: LineSprite[];

  constructor(
    terrain: GameTerrain,
    position: Vector,
    velocity: Vector,
    turns: number,
    coordinateConverter: CoordinateConverter,
    scene: THREE.Object3D
  ) {
    this.terrain = terrain;
    this.position = position;
    this.velocity = velocity;
    this.turns = turns;
    this.coordinateConverter = coordinateConverter;
    this.scene = scene;

    this.objects = [];

    this.create();
  }

  remove() {
    this.objects.forEach((object3d) => {
      this.scene.remove(object3d.getMesh());
      object3d.destroy();
    });
  }

  create() {
    let turns = 1000;
    const start = performance.now();
    let position = this.position;
    const velocity = this.velocity;

    while (turns--) {
      const newVelocity = this.terrain.getGravityVectorForTurn(
        position,
        velocity,
        1
      );

      position = position.add(newVelocity);
      //this.createLine(positions);
    }

    console.log("building path took", performance.now() - start, "ms");
  }
  /*
  createLine(positions: Vector[]) {
    //positions.forEach(pos => console.log(pos.toString()));

    let start = positions.shift();

    positions.forEach((end) => {
      const line = new LineSprite(
        start,
        end,
        5,
        new THREE.Color(132 / 255, 165 / 255, 206 / 255),
        0.5
      );

      this.scene.add(line.mesh);
      this.objects.push(line);

      start = end;
    });
  }
    */
}

export default NavigationalMovementPath;
