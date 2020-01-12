import TorpedoObject from "../ships/TorpedoObject";

class TorpedoIconContainer {
  constructor(scene) {
    this.scene = scene;

    this.icons = [];
  }

  getArray() {
    return this.icons;
  }

  hasIcon(id) {
    return Boolean(this.getIconById(id));
  }

  getIconByTorpedoFlight(flight) {
    let icon = this.getIconById(flight.id);
    if (!icon) {
      icon = new TorpedoObject(flight, this.scene);
      this.icons.push(icon);
    }

    return icon;
  }

  getIconById(id) {
    return this.icons.find(icon => icon.torpedoFlight.id === id);
  }

  render(renderPayload) {
    this.icons.forEach(icon => icon.render(renderPayload));
  }
}

export default TorpedoIconContainer;
