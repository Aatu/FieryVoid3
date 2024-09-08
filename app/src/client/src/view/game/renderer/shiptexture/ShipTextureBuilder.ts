import abstractCanvas from "../../utils/abstractCanvas";
import * as THREE from "three";
import GameObject3D from "../gameObject/GameObject3D";
import { degreeToRadian } from "@fieryvoid3/model/src/utils/math";

type DrawImageArgs = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  flipX?: boolean;
  flipY?: boolean;
  rotation?: number;
};

type DrawTextArgs = {
  x: number;
  y: number;
  width?: number;
  size?: number;
  flipX?: boolean;
  flipY?: boolean;
  bold?: boolean;
  font?: string;
};

export class ShipTextureBuilder {
  private width: number;
  private height: number;
  private canvas: HTMLCanvasElement;
  private baseObject: GameObject3D;
  private promises: Promise<unknown>[] = [];
  private materialName: string;

  constructor(
    baseObject: GameObject3D,
    materialName: string,
    width: number,
    height: number
  ) {
    this.width = width;
    this.height = height;
    this.baseObject = baseObject;
    this.materialName = materialName;

    this.canvas = abstractCanvas.create(width, height);
  }

  public async done() {
    await Promise.all(this.promises);

    this.baseObject.setMap(this.getTexture(), this.materialName);
  }

  public getTexture() {
    const tempCanvas = abstractCanvas.create(this.width, this.height);

    const context = tempCanvas.getContext("2d") as CanvasRenderingContext2D;
    context.translate(0, this.height);
    context.scale(1, -1);
    context.drawImage(this.canvas, 0, 0);

    return new THREE.CanvasTexture(tempCanvas);
  }

  public async setBaseColor(color: number[]) {
    const { resolve, promises } = this.addPromise();

    await Promise.all(promises);

    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    context.rect(0, 0, this.width, this.height);
    context.fillStyle = `rgb(${color[0]} ${color[1]} ${color[2]})`;
    context.fill();
    resolve(true);
  }

  public async overlayImage(src: string, args?: DrawImageArgs) {
    this.drawImage(src, args, "overlay");
  }

  public async drawImage(
    src: string,
    args?: DrawImageArgs,
    mode: GlobalCompositeOperation = "source-over"
  ) {
    const { resolve, promises } = this.addPromise();

    let x = args?.x ?? 0;
    let y = args?.y ?? 0;
    const width = args?.width ?? this.width;
    const height = args?.height ?? this.height;
    const flipX = args?.flipX ?? false;
    const flipY = args?.flipY ?? false;
    const rotation = args?.rotation ?? 0;

    x = flipX ? -x : x;
    y = flipY ? -y : y;

    const img = await this.loadImage(src);

    await Promise.all(promises);

    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    context.save();
    context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    context.translate(x, y);
    context.rotate(degreeToRadian(rotation));
    context.globalCompositeOperation = mode;
    context.drawImage(img, 0, 0, width, height);
    context.restore();

    resolve(true);
  }

  public async writeText(text: string, color: number[], args?: DrawTextArgs) {
    const { resolve, promises } = this.addPromise();

    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    await Promise.all(promises);

    let x = args?.x ?? 0;
    let y = args?.y ?? 0;
    const flipX = args?.flipX ?? false;
    const flipY = args?.flipY ?? false;

    x = flipX ? -x : x;
    y = flipY ? -y : y;

    context.save();
    //context.translate(0, this.height);
    context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    this.setFont(text, context, args);

    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${
      color[3] ?? 1
    })`;

    context.fillText(text, x, y);
    context.restore();

    resolve(true);
  }

  private setFont(
    text: string,
    context: CanvasRenderingContext2D,
    args?: DrawTextArgs
  ): void {
    let size = args?.size ?? 1;
    const font = args?.font ?? "Arial";
    const bold = args?.bold ? "bold " : "";
    const width = args?.width ?? null;

    const toString = (s: number) => `${bold}${s}px ${font}`;

    let fits = false;
    let direction = 0;

    do {
      context.font = toString(size);
      const measurement = context.measureText(text);

      if (size < 0) {
        throw new Error("no");
      }

      if (
        width !== null &&
        measurement.width < width &&
        direction === 0 &&
        size !== 1
      ) {
        break;
      }

      if (width !== null && measurement.width < width) {
        if (direction === -1) {
          size--;
          break;
        }
        direction = 1;
        size++;
      } else if (width !== null && measurement.width > width) {
        if (direction === 11) {
          size++;
          break;
        }
        direction = -1;
        size--;
      } else {
        fits = true;
      }
    } while (width !== null || fits === false);
  }

  private addPromise(): {
    resolve: (value: unknown) => void;
    promises: Promise<unknown>[];
  } {
    let resolve: null | ((value: unknown) => void) = null;

    const promise = new Promise((r) => {
      resolve = r;
    });

    const promises = [...this.promises];

    this.promises.push(promise);

    return { resolve: resolve!, promises };
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.src = src;
    });
  }
}
