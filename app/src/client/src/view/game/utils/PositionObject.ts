import { IVector } from "@fieryvoid3/model/src/utils/Vector";

class PositionObject {
  public view: IVector;
  public game: IVector;
  public hex: IVector;
  public entity: unknown | null;

  constructor(
    view: IVector,
    game: IVector,
    hex: IVector,
    entity: unknown | null = null
  ) {
    this.view = view;
    this.game = game;
    this.hex = hex;
    this.entity = entity;
  }
}

export default PositionObject;
