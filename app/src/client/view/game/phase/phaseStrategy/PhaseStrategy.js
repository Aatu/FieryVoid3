const getInterestingStuffInPosition = (payload, shipIconContainer) => {
  const mouseovered = payload.entities.filter(
    entity => entity instanceof window.ShipObject && !entity.ship.isDestroyed()
  );

  if (mouseovered.length > 0) {
    return mouseovered;
  }

  return shipIconContainer
    .getIconsInProximity(payload)
    .filter(icon => !icon.ship.isDestroyed());
};

class PhaseStrategy {
  constructor(services) {
    this.services = services;
    this.strategies = [];

    this.currentlyMouseOveredIds = null;
  }

  onEvent(name, payload) {
    this.callStrategies(name, payload);
  }

  updateStrategies(gamedata) {
    this.strategies.forEach(strategy => strategy.update(gamedata));
  }

  activateStrategies() {
    this.strategies.forEach(strategy => strategy.activate(this.services));
  }

  callStrategies(functionName, payload) {
    this.strategies.forEach(strategy => strategy[functionName](payload));
  }

  render(coordinateConverter, scene, zoom) {
    this.animationStrategy &&
      this.animationStrategy.render(coordinateConverter, scene, zoom);
    this.callStrategies("render", { scene, zoom });
  }

  update(gamedata) {
    this.updateStrategies(gamedata);
    this.animationStrategy && this.animationStrategy.update(gamedata);

    return this;
  }

  activate() {
    this.inactive = false;
    this.activateStrategies();
    return this;
  }

  deactivate() {
    this.inactive = true;
    this.animationStrategy.deactivate();
    this.callStrategies("deactivate");

    return this;
  }

  triggerEvent(name, payload) {
    this.callStrategies(name, payload);
  }

  onScrollEvent(payload) {
    this.callStrategies("onScroll", payload);
  }

  onZoomEvent(payload) {
    this.callStrategies("onZoom", payload);
  }

  onClickEvent(payload) {
    const icons = getInterestingStuffInPosition(
      payload,
      this.services.shipIconContainer
    );

    this.callStrategies("onClick", payload);

    if (payload.cancelled) {
      return;
    }

    if (icons.length > 1) {
      this.callStrategies("onShipsClick", {
        ships: icons.map(icon => icon.ship),
        payload
      });
    } else if (icons.length === 1) {
      if (payload.button !== 0 && payload.button !== undefined) {
        this.callStrategies("onShipsRightClick", {
          ship: icons[0].ship,
          payload
        });
      } else {
        this.callStrategies("onShipClick", {
          ships: icons[0].ship,
          payload
        });
      }
    } else {
      this.callStrategies("onHexClick", payload);
    }
  }

  onMouseMoveEvent(payload) {
    const icons = getInterestingStuffInPosition(
      payload,
      this.services.shipIconContainer
    );

    if (icons.length === 0 && this.currentlyMouseOveredIds !== null) {
      this.currentlyMouseOveredIds = null;
      this.callStrategies("mouseOutShips", { payload });
      return;
    } else if (icons.length === 0) {
      return;
    }

    var mouseOverIds = icons.reduce(function(value, icon) {
      return value + icon.shipId;
    }, "");

    if (mouseOverIds === this.currentlyMouseOveredIds) {
      return;
    }

    this.currentlyMouseOveredIds = null;
    this.callStrategies("mouseOutShips", { payload });

    this.currentlyMouseOveredIds = mouseOverIds;

    var ships = icons.map(icon => icon.ship);

    if (ships.length > 1) {
      this.callStrategies("mouseOverShips", { ships, payload });
    } else {
      this.callStrategies("mouseOverShip", { ship: ships[0], payload });
    }
  }

  changeAnimationStrategy(newAnimationStartegy) {
    this.animationStrategy && this.animationStrategy.deactivate();
    this.animationStrategy = newAnimationStartegy;
    this.animationStrategy.activate();
  }

  onShipMovementChanged(payload) {
    var ship = payload.ship;
    this.shipIconContainer.getByShip(ship).consumeMovement(ship.movement);

    if (this.animationStrategy) {
      this.animationStrategy.shipMovementChanged(ship);
    }

    this.callStrategies("shipMovementChanged", { ship });
  }
}

export default PhaseStrategy;
