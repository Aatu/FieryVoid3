import TextSprite from "../renderer/sprite/TextSprite";
import Animation from "./Animation";
import Vector, { IVector } from "@fieryvoid3/model/src/utils/Vector";
import * as THREE from "three";
import { RenderPayload } from "../phase/phaseStrategy/PhaseStrategy";
import coordinateConverter from "@fieryvoid3/model/src/utils/CoordinateConverter";

const getSprite = (name: string, position: IVector, scene: THREE.Object3D) => {
  let sprite = null;

  /*
  if (name.structure) {
    sprite = new TextSprite(
      name.toUpperCase(),
      "rgba(255, 100, 45, 0.7)",
      position.z + 30,
      {
        fontSize: "24px",
        size: 512,
      }
    );
  } else {
   */
  sprite = new TextSprite(
    name.toUpperCase(),
    "rgba(255, 255, 255, 0.7)",
    position.z + 30,
    {
      fontSize: "18px",
      size: 512,
    }
  );
  //}

  sprite.setPosition(position);
  sprite.setOpacity(0);
  scene.add(sprite.getMesh());

  return sprite;
};

const changeTimeIfNeccessary = (
  position: Vector,
  time: number,
  texts: Text[]
) => {
  const inSameHex = getInSameHex(position, texts);

  if (inSameHex.length === 0) {
    return time;
  }

  while (isTooClose(time, inSameHex)) {
    time += 200;
  }

  return time;
};

const getInSameHex = (position: Vector, texts: Text[]) => {
  const gamePosition = coordinateConverter.fromGameToHex(position);

  return texts.filter((text) =>
    coordinateConverter.fromGameToHex(text.position).equals(gamePosition)
  );
};

const isTooClose = (time: number, texts: Text[]) => {
  return texts.some(
    (text) => text.time - time < 200 && text.time - time > -200
  );
};

type Text = {
  time: number;
  position: Vector;
  sprite: TextSprite;
};

class SystemDestroyedTextAnimation extends Animation {
  private scene: THREE.Object3D;
  private fadeOutSpeed: number;
  private velocity: number;
  private destroyedTexts: Text[] = [];

  constructor(scene: THREE.Object3D) {
    super();

    this.scene = scene;

    this.duration = 1000;
    this.fadeOutSpeed = 2000;
    this.velocity = 0.1;
    this.destroyedTexts = [];
  }

  deactivate() {
    this.destroyedTexts.forEach((destroyedText) => {
      this.scene.remove(destroyedText.sprite.getMesh());
      destroyedText.sprite.destroy();
    }, this);

    this.destroyedTexts = [];
  }

  add(position: Vector, names: string[] | string, time: number) {
    names = ([] as string[]).concat(names);
    names.filter(Boolean).forEach((name) => {
      this.destroyedTexts.push({
        time: changeTimeIfNeccessary(position, time, this.destroyedTexts),
        position,
        sprite: getSprite(name, position, this.scene),
      });
    }, this);
  }

  render({ total, zoom }: RenderPayload) {
    this.destroyedTexts.forEach((text) => {
      const time = text.time;
      const sprite = text.sprite;

      if (total < time || total > time + this.duration + this.fadeOutSpeed) {
        sprite.setOpacity(0);
        return;
      }

      sprite.setScale(zoom, zoom);
      const ellapsedTime = total - time;
      const newPos = {
        ...text.position,
        y: text.position.y + this.velocity * zoom * ellapsedTime,
      };
      sprite.setPosition(newPos);

      const fadeTime = total - (time + this.duration);

      if (fadeTime < 0) {
        sprite.setOpacity(1);
      } else {
        const opacity = 1 - fadeTime / this.fadeOutSpeed;
        sprite.setOpacity(opacity);
      }
    });
  }

  getDuration() {
    return 0;
  }

  update(): void {}
}

export default SystemDestroyedTextAnimation;
