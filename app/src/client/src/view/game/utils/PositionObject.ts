import { Offset } from "@fieryvoid3/model/src/hexagon";
import { IVector } from "@fieryvoid3/model/src/utils/Vector";

class PositionObject {
  public view: { x: number; y: number; xR: number; yR: number };
  public game: IVector;
  public hex: Offset;
  public entity: unknown | null;

  constructor(
    view: { x: number; y: number; xR: number; yR: number },
    game: IVector,
    hex: Offset,
    entity: unknown | null = null
  ) {
    this.view = view;
    this.game = game;
    this.hex = hex;
    this.entity = entity;
  }
}

export default PositionObject;
