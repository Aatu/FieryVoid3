import TorpedoFlight from "@fieryvoid3/model/src/unit/TorpedoFlight";
import TorpedoObject from "../ships/TorpedoObject";
import * as THREE from "three";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";

class TorpedoIconContainer {
  private scene: THREE.Object3D;
  private icons: TorpedoObject[];

  constructor(scene: THREE.Object3D) {
    this.scene = scene;

    this.icons = [];
  }

  getArray() {
    return this.icons;
  }

  hasIcon(id: string) {
    return Boolean(this.getIconById(id));
  }

  getIconByTorpedoFlight(flight: TorpedoFlight) {
    let icon = this.getIconById(flight.id);
    if (!icon) {
      icon = new TorpedoObject(flight, this.scene);
      this.icons.push(icon);
    }

    return icon;
  }

  getIconById(id: string) {
    return this.icons.find((icon) => icon.torpedoFlight.id === id);
  }

  render(renderPayload: RenderPayload) {
    this.icons.forEach((icon) => icon.render(renderPayload));
  }
}

export default TorpedoIconContainer;
