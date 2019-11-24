import * as gameUiModes from "./gameUiModes";
import { HEX_SIZE } from "../../../../model/gameConfig.mjs";
import { angleToHexFacing } from "../../../../model/utils/math.mjs";

class UIState {
  constructor() {
    this.phaseDirector = null;
    this.services = null;

    this.renderListeners = [];

    this.systemChangeListeners = [];

    this.state = {
      lobby: false,
      gameData: null,
      selectedShip: null,
      selectedSystems: [],
      systemInfo: null,
      systemInfoMenu: null,
      shipMovement: null,
      shipTooltip: [],
      turnReady: false,
      shipTooltipMenuProvider: null,
      systemMenu: {
        systemInfoMenuProvider: null,
        activeSystem: null,
        activeSystemElement: null
      },
      shipBadges: [],
      gameUiMode: {},
      gameUiModeButtons: false,
      replayUi: false,
      combatLog: false,
      systemList: [],
      ewList: [],
      stateVersion: 0
    };

    this.state.gameUiMode[gameUiModes.EW] = false;
    this.state.gameUiMode[gameUiModes.ENEMY_WEAPONS] = false;
    this.state.gameUiMode[gameUiModes.WEAPONS] = false;
    this.state.gameUiMode[gameUiModes.MOVEMENT] = false;

    this.updateState();
  }

  showShipBadge(icon, showName) {
    const { coordinateConverter } = this.services;
    const entry = this.state.shipBadges.find(
      badge => badge.icon.ship.id === icon.ship.id
    );

    const getPosition = () => {
      const iconPosition = icon.getPosition();
      const iconFacing = icon.getFacing();
      const hexFacing = angleToHexFacing(iconFacing);
      const offset = HEX_SIZE - 15;

      const hexas = icon.ship.getIconHexas(hexFacing).map(hex => {
        const gamePos = coordinateConverter
          .fromHexToGame(hex)
          .add(iconPosition);
        gamePos.y -= offset;
        return coordinateConverter.fromGameToViewPort(gamePos);
      });

      let lowestY = null;
      let lowestHexas = [];

      hexas.forEach(hex => {
        if (lowestY === null || hex.y > lowestY) {
          lowestHexas = [hex];
          lowestY = hex.y;
        } else if (hex.y === lowestY) {
          lowestHexas.push(hex);
        }
      });

      const averageX =
        lowestHexas.reduce((total, hex) => total + hex.x, 0) /
        lowestHexas.length;

      const position = {
        x: averageX,
        y: lowestY
      };

      return position;
    };

    if (entry) {
      entry.icon = icon;
      entry.version++;
      entry.getPosition = getPosition;
      entry.showName = showName;
    } else {
      this.state.shipBadges.push({
        icon,
        version: 0,
        getPosition,
        showName
      });
    }

    this.updateState();
  }

  hideShipBadge(icon) {
    this.state.shipBadges = this.state.shipBadges.filter(
      entry => entry.icon.ship.id !== icon.ship.id
    );

    this.updateState();
  }

  setEwList(entries) {
    this.state.ewList = entries;
  }

  setSystemList(systems) {
    this.state.systemList = systems;
    this.updateState();
  }

  isSelectedSystem(system) {
    return this.state.selectedSystems.includes(system);
  }

  selectSystem(ship, systems) {
    if (this.getSelectedShip() !== ship) {
      this.selectShip(ship);
    }

    systems = []
      .concat(systems)
      .filter(system => !this.isSelectedSystem(system))
      .forEach(system => this.state.selectedSystems.push(system));

    this.updateState();
    this.customEvent("systemSelected", { systems });
  }

  deselectSystem(systems) {
    systems = [].concat(systems);

    this.state.selectedSystems = this.state.selectedSystems.filter(selected =>
      systems.every(system => system.id !== selected.id)
    );

    this.updateState();
    this.customEvent("systemDeselected", { systems });
  }

  deselectAllSystems() {
    const systems = this.state.selectedSystems;
    this.state.selectedSystems = [];
    this.updateState();
    this.customEvent("systemDeselected", { systems });
  }

  getSelectedSystems() {
    return this.state.selectedSystems;
  }

  hasGameUiMode(values) {
    values = [].concat(values);
    return values.some(value => this.state.gameUiMode[value]);
  }

  toggleGameUiMode(value) {
    this.state.gameUiMode[value] = !this.state.gameUiMode[value];
    this.updateState();
  }

  showUiModeButtons(value) {
    this.state.gameUiModeButtons = value;
    this.updateState();
  }

  showReplayUi(value) {
    this.state.replayUi = value;
    this.updateState();
  }

  showCombatLog(value) {
    this.state.combatLog = value;
    this.updateState();
  }

  startReplay() {
    this.phaseDirector.startReplay();
    this.updateState();
  }

  closeReplay() {
    this.phaseDirector.closeReplay();
    this.updateState();
  }

  isReplay() {
    return this.state.replay;
  }

  init(setState) {
    this.setState = setState;
    this.updateState();
  }

  update(gameData) {
    this.gameData = gameData;
    if (this.state.selectedShip) {
      this.selectShip(
        this.gameData.ships.getShipById(this.state.selectedShip.id)
      );

      this.selectSystem(
        this.getSelectedShip(),
        this.state.selectedSystems.map(system =>
          this.getSelectedShip().systems.getSystemById(system.id)
        )
      );
    }
  }

  setTurnReady(ready) {
    this.state.turnReady = ready;
    this.updateState();
  }

  setWaiting(waiting) {
    this.state.waiting = waiting;
    this.updateState();
  }

  setPhaseDirector(phaseDirector) {
    this.phaseDirector = phaseDirector;
    this.services = phaseDirector.getServices();
  }

  customEvent(name, payload) {
    this.phaseDirector.relayEvent(name, payload);
  }

  commitTurn() {
    this.phaseDirector.commitTurn();
  }

  selectShip(ship) {
    if (this.getSelectedShip() === ship) {
      return;
    }

    this.deselectShip();
    this.state.selectedShip = ship;
    this.updateState();
    this.customEvent("shipSelected", ship);
  }

  deselectShip() {
    const ship = this.state.selectedShip;
    this.state.selectedShip = null;
    this.updateState();
    this.deselectAllSystems();
    if (ship) {
      this.customEvent("shipDeselected", ship);
    }
  }

  getSelectedShip() {
    return this.state.selectedShip;
  }

  isSelected(ship) {
    return this.state.selectedShip === ship;
  }

  updateState() {
    if (!this.setState) {
      return;
    }

    this.state.stateVersion++;
    this.setState({ uiState: this });
    this.customEvent("uiStateChanged");
  }

  setTooltipMenuProvider(callBack) {
    this.state.shipTooltipMenuProvider = callBack;
    this.updateState();
  }

  setSystemInfoMenuProvider(callBack) {
    this.state.systemMenu.systemInfoMenuProvider = callBack;
    this.updateState();
  }

  setSystemMenuActiveSystem(system, element) {
    this.state.systemMenu.activeSystem = system;
    this.state.systemMenu.activeSystemElement = element;
    this.updateState();
  }

  setGameData(gameData) {
    this.state.gameData = gameData.serialize();
    this.updateState();
  }

  setLobby(status) {
    this.state.lobby = status;
    this.updateState();
  }

  getState() {
    return this.state;
  }

  showSystemInfo(args) {
    this.state.systemInfo = args;
    this.updateState();
  }

  hideSystemInfo() {
    this.state.systemInfo = null;
    this.updateState();
  }

  showSystemInfoMenu(args) {
    this.state.systemInfoMenu = args;
    this.updateState();
  }

  hideSystemInfoMenu() {
    this.state.systemInfoMenu = null;
    this.updateState();
  }

  shipStateChanged(ship) {
    this.customEvent("shipStateChanged", ship);
  }

  shipSystemStateChanged(ship, system) {
    this.customEvent("shipSystemStateChanged", { ship, system });
    this.systemChangeListeners.forEach(callBack => callBack(ship, system));
  }

  showShipTooltip(icon, ui = false) {
    const { coordinateConverter } = this.services;
    const ship = icon.ship;

    this.hideShipTooltip(ship);
    this.state.shipTooltip.push({
      ship,
      getPosition: () =>
        coordinateConverter.fromGameToViewPort(icon.getPosition()),
      ui
    });
    this.updateState();
  }

  hideShipTooltip(ship) {
    this.state.shipTooltip = this.state.shipTooltip.filter(
      tooltip => tooltip.ship.id !== ship.id
    );
    this.updateState();
  }

  showShipDeploymentMovement(ship) {
    const {
      shipIconContainer,
      coordinateConverter,
      movementService
    } = this.services;

    this.state.shipMovement = {
      ship,
      type: "deploy",
      movementService,
      getPosition: () =>
        coordinateConverter.fromGameToViewPort(
          shipIconContainer.getByShip(ship).getPosition()
        )
    };
    this.updateState();
  }

  showShipMovement(ship) {
    const {
      shipIconContainer,
      coordinateConverter,
      movementService
    } = this.services;

    this.state.shipMovement = {
      ship,
      type: "game",
      movementService,
      getPosition: () =>
        coordinateConverter.fromGameToViewPort(
          shipIconContainer.getByShip(ship).getPosition()
        )
    };
    this.updateState();
  }

  hideShipMovement() {
    this.state.shipMovement = null;
    this.updateState();
  }

  render() {
    this.renderListeners.forEach(listener => listener());
  }

  subscribeToRender(callBack) {
    this.renderListeners.push(callBack);
  }

  unsubscribeFromRender(callBack) {
    this.renderListeners = this.renderListeners.filter(
      listener => listener !== callBack
    );
  }

  subscribeToSystemChange(callBack) {
    this.systemChangeListeners.push(callBack);
  }

  unsubscribeFromSystemChange(callBack) {
    this.systemChangeListeners = this.systemChangeListeners.filter(
      listener => listener !== callBack
    );
  }
}

export default UIState;
