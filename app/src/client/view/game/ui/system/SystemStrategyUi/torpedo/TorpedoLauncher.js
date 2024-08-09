import React from "react";

import {
  IconAndLabel,
  TooltipHeader,
  TooltipSubHeader,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
  InlineTooltipEntry,
} from "../../../../../../styled";
import styled from "styled-components";
import CargoItem from "../cargo/CargoItem";
import NoAmmunitionLoaded from "../../../../../../../model/unit/system/weapon/ammunition/NoAmmunitionLoaded";

const TorpedoList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TorpedoCargoItem = styled(CargoItem)`
  ${IconAndLabel} {
    ${(props) => {
      const { target } = props;

      if (target) {
        return "filter: hue-rotate(0deg) brightness(4) grayscale(0);";
      }
    }}
  }
`;

class TorpedoLauncher extends React.PureComponent {
  systemChangedCallback(ship, system) {
    if (
      ship.id === this.props.ship.id &&
      system.id === this.props.launcher.system.id
    ) {
      this.forceUpdate();
    }
  }

  componentDidMount() {
    const { uiState } = this.props;
    this.systemChangedCallbackInstance = this.systemChangedCallback.bind(this);
    uiState.subscribeToSystemChange(this.systemChangedCallbackInstance);
  }

  componentWillUnmount() {
    const { uiState } = this.props;
    uiState.unsubscribeFromSystemChange(this.systemChangedCallbackInstance);
  }

  unloadAmmo() {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { ship, launcher, uiState, launcherIndex } = this.props;

      launcher.unloadAmmo({ launcherIndex });
      uiState.shipSystemStateChanged(ship, launcher.system);
    };
  }

  loadTorpedo(torpedo) {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { ship, launcher, uiState, launcherIndex } = this.props;

      launcher.loadAmmo({ ammo: torpedo, launcherIndex });
      uiState.shipSystemStateChanged(ship, launcher.system);
    };
  }

  torpedoMouseOut(ship, torpedo) {
    return () => {
      const { uiState } = this.props;

      uiState.customEvent("torpedoMouseOut", {
        ship,
        torpedo,
      });
    };
  }

  torpedoMouseOver(ship, torpedo) {
    return () => {
      const { uiState } = this.props;

      uiState.customEvent("torpedoMouseOver", {
        ship,
        torpedo,
        target: this.getLoadedTorpedoTarget(),
      });
    };
  }

  getLoadedTorpedoTarget() {
    const { loadedTorpedo, launcher, uiState } = this.props;

    if (!loadedTorpedo) {
      return null;
    }

    const targetId = launcher.launchTarget;

    if (!targetId) {
      return null;
    }

    const { gameData } = uiState;

    return gameData.ships.getShipById(targetId);
  }

  render() {
    const { launcherIndex, loadedTorpedo, loadingTime, turnsLoaded, launcher } =
      this.props;

    return (
      <>
        <TooltipHeader>Torpedo tube {launcherIndex}</TooltipHeader>
        <InlineTooltipEntry>
          <TooltipEntry>
            <TooltipValueHeader>Loading: </TooltipValueHeader>
            <TooltipValue>{`${turnsLoaded}/${loadingTime}`}</TooltipValue>
          </TooltipEntry>

          <InlineTooltipEntry>
            <TooltipValueHeader>Loaded torpedo:</TooltipValueHeader>
            <TorpedoCargoItem
              cargo={loadedTorpedo ? loadedTorpedo : new NoAmmunitionLoaded()}
              amount={null}
              target={this.getLoadedTorpedoTarget()}
              handleMouseOver={this.torpedoMouseOver(
                launcher.system.shipSystems.ship,
                loadedTorpedo
              ).bind(this)}
              handleMouseOut={this.torpedoMouseOut(
                launcher.system.shipSystems.ship,
                loadedTorpedo
              ).bind(this)}
            />
          </InlineTooltipEntry>
        </InlineTooltipEntry>

        <TooltipEntry>
          <TooltipValueHeader>Select torpedo to load: </TooltipValueHeader>
        </TooltipEntry>

        <TorpedoList>
          {launcher.getPossibleTorpedosToLoad().map(({ object, amount }, i) => (
            <CargoItem
              handleOnClick={this.loadTorpedo(object).bind(this)}
              key={`torpedo-launcer-${i}-possible-torpedo-${object.constructor.name}`}
              cargo={object}
              amount={amount}
              handleMouseOver={this.torpedoMouseOver(
                launcher.system.shipSystems.ship,
                object
              ).bind(this)}
              handleMouseOut={this.torpedoMouseOut(
                launcher.system.shipSystems.ship,
                object
              ).bind(this)}
            />
          ))}
          {loadedTorpedo && (
            <CargoItem
              handleOnClick={this.unloadAmmo().bind(this)}
              key={`torpedo-launcer-unload`}
              cargo={new NoAmmunitionLoaded()}
              amount={null}
            />
          )}
        </TorpedoList>
      </>
    );
  }
}

export default TorpedoLauncher;
