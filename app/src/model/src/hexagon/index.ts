import Cube from "./Cube";
import Offset from "./Offset";

export interface IHexPosition {
  getHexPosition: () => Offset;
}

export { Cube, Offset };
