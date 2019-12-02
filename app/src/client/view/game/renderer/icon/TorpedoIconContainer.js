import * as shipObjects from "../ships";
import { distance } from "../../../../../model/utils/math";
import TorpedoObject from "../ships/TorpedoObject";

const buildShipArray = iconsAsObject => {
  return Object.keys(iconsAsObject).map(key => iconsAsObject[key]);
};

const createIcon = (ship, scene) => {
  return new shipObjects[ship.shipModel](ship, scene);
};

const createGhostShipIcon = (ship, scene, currentUser) => {
  const icon = new shipObjects[ship.shipModel](ship, scene);
  icon.setGhostShip(ship.player.is(currentUser));
  icon.hide();

  return icon;
};

class TorpedoIconContainer {
  constructor(scene, currentUser) {
    this.scene = scene;
    this.currentUser = currentUser;

    this.ghostShipIcons = [];
  }

  hasIcon(id) {
    return Boolean(this.getIconById(id));
  }

  getIconByTorpedoFlight(flight) {
    return this.getIconById(flight.id);
  }

  getIconById(id) {
    return this.icons.find((icon = icon.flight.id === id));
  }

  update(gamedata) {
    gamedata.torpedos.getTorpedoFlights().forEach(torpedoFlight => {
      if (!this.hasIcon(torpedoFlight.id)) {
        this.icons.push = new TorpedoObject(torpedoFlight, this.scene);
      } else {
        this.getIconByTorpedoFlight(torpedoFlight).update(torpedoFlight);
      }
    });

    this.icons = this.icons.filter(icon => {
      const found = gamedata.torpedos
        .getTorpedoFlights()
        .find(torpedo => torpedo.id === icon.flight.id);

      if (!found) {
        icon.destroy();
        return false;
      } else {
        return true;
      }
    });
  }

  render(renderPayload) {
    this.iconsAsArray.forEach(icon => icon.render(renderPayload));
  }
}

export default ShipIconContainer;
