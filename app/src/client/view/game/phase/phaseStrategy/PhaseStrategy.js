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
    this.inactive = true;

    this.lastAnimationTime = 0;
    this.totalAnimationTime = 0;
    this.currentDeltaTime = 0;

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
    this.strategies.forEach(strategy => {
      if (strategy[functionName] && !payload.stopped) {
        strategy[functionName](payload);
      }
    });
  }

  render(coordinateConverter, scene, zoom) {
    this.updateDeltaTime();
    this.updateTotalAnimationTime();

    this.animationStrategy &&
      this.animationStrategy.render(coordinateConverter, scene, zoom);

    const { shipIconContainer } = this.services;

    shipIconContainer &&
      shipIconContainer.render(coordinateConverter, scene, zoom);
    this.callStrategies("render", {
      delta: this.currentDeltaTime,
      total: this.totalAnimationTime,
      last: this.lastAnimationTime
    });
  }

  updateTotalAnimationTime(paused) {
    if (paused) {
      return;
    }

    if (this.goingBack) {
      this.totalAnimationTime -= this.currentDeltaTime;
    } else {
      this.totalAnimationTime += this.currentDeltaTime;
    }
  }

  updateDeltaTime(paused) {
    const now = Date.now();

    if (!this.lastAnimationTime) {
      this.lastAnimationTime = now;
      this.currentDeltaTime = 0;
    }

    if (!paused) {
      this.currentDeltaTime = now - this.lastAnimationTime;
    }

    this.lastAnimationTime = now;
  }

  update(gamedata) {
    const { uiState } = this.services;
    uiState.setGameData(gamedata);
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
