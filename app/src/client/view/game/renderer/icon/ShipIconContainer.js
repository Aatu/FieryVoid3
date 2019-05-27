import * as shipObjects from "../ships";
import { distance } from "../../../../../model/utils/math";

const buildShipArray = iconsAsObject => {
  return Object.keys(iconsAsObject).map(key => iconsAsObject[key]);
};

const createIcon = (ship, scene, currentUser) =>
  new shipObjects[ship.shipModel](ship, scene, ship.player.is(currentUser));

class ShipIconContainer {
  constructor(scene, currentUser) {
    this.iconsAsObject = {};
    this.iconsAsArray = [];
    this.scene = scene;
    this.currentUser = currentUser;
  }

  update(gamedata) {
    gamedata.ships.getShips().forEach(ship => {
      if (!this.hasIcon(ship.id)) {
        this.iconsAsObject[ship.id] = createIcon(
          ship,
          this.scene,
          this.currentUser
        );
      } else {
        this.iconsAsObject[ship.id].consumeShipdata(ship);
      }
    });

    this.iconsAsArray = buildShipArray(this.iconsAsObject);
  }

  getByShip(ship) {
    return this.iconsAsObject[ship.id];
  }

  getById(id) {
    return this.iconsAsObject[id];
  }

  onEvent(name, payload) {
    var target = this["on" + name];
    if (target && typeof target === "function") {
      target.call(this, payload);
    }
  }

  onZoomEvent(payload) {
    var zoom = payload.zoom;

    var alpha = zoom > 2 ? zoom - 2 : 0;
    if (alpha > 1) {
      alpha = 1;
    }
    this.iconsAsArray.forEach(function(icon) {
      icon.setOverlayColorAlpha(alpha);
    });
  }

  getArray() {
    return this.iconsAsArray;
  }

  hasIcon(shipId) {
    return Boolean(this.iconsAsObject[shipId]);
  }

  getIconById(shipId) {
    return this.iconsAsObject[shipId];
  }

  getIconsInProximity(payload) {
    var hexHeight = this.coordinateConverter.getHexHeightViewport();
    var currentDistance = hexHeight / 10;

    var icons = [];

    if (currentDistance < 30) {
      icons = this.getIconsInSameHex(payload.hex);
    } else {
      var closest = null;
      var closestDistance = null;

      this.iconsAsArray.forEach(function(shipIcon) {
        var currentDistance = distance(shipIcon.getPosition(), payload.game);

        if (
          currentDistance < 10 &&
          (!closest || currentDistance < closestDistance)
        ) {
          closest = shipIcon;
          closestDistance = currentDistance;
        }
      }, this);

      if (closest) icons.push(closest);
    }

    return icons;
  }

  getIconsInSameHex(hex) {
    return this.iconsAsArray.filter(function(shipIcon) {
      return this.coordinateConverter
        .fromGameToHex(shipIcon.getPosition())
        .equals(hex);
    }, this);
  }

  getFinalMovementInSameHex(hex) {
    return this.iconsAsArray.filter(function(shipIcon) {
      return (
        !shipIcon.ship.isDestroyed() &&
        shipIcon.getLastMovement().position.equals(hex)
      );
    }, this);
  }

  render(coordinateConverter, scene, zoom) {
    this.iconsAsArray.forEach(icon =>
      icon.render(coordinateConverter, scene, zoom)
    );
  }
}

export default ShipIconContainer;
