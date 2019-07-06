import ShipObject from "./ShipObject";
import { cloneObject } from "../../utils/objectLoader";

class GhostShipObject {
  constructor(ship, scene, shipObject) {
    this.ship = ship;
    this.scene = scene;
    this.shipObject = cloneObject(shipObject);
  }
}

export default GhostShipObject;
