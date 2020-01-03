import React from "react";

import {
  IconAndLabel,
  TooltipHeader,
  TooltipSubHeader,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
  InlineTooltipEntry
} from "../../../../../../styled";
import styled from "styled-components";
import CargoItem from "../cargo/CargoItem";
import NoAmmunitionLoaded from "../../../../../../../model/unit/system/weapon/ammunition/NoAmmunitionLoaded.mjs";

const TorpedoList = styled.div`
  display: flex;
  flex-wrap: wrap;
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
    return e => {
      e.preventDefault();
      e.stopPropagation();
      const { ship, launcher, uiState, launcherIndex } = this.props;

      launcher.unloadAmmo({ launcherIndex });
      uiState.shipSystemStateChanged(ship, launcher.system);
    };
  }

  loadTorpedo(torpedo) {
    return e => {
      e.preventDefault();
      e.stopPropagation();
      const { ship, launcher, uiState, launcherIndex } = this.props;

      launcher.loadAmmo({ ammo: torpedo, launcherIndex });
      uiState.shipSystemStateChanged(ship, launcher.system);
    };
  }

  render() {
    const {
      launcherIndex,
      loadedTorpedo,
      loadingTime,
      turnsLoaded,
      torpedoClass,
      launcher
    } = this.props;

    return (
      <>
        <TooltipHeader>Torpedo tube {launcherIndex}</TooltipHeader>
        <InlineTooltipEntry>
          <TooltipEntry>
            <TooltipValueHeader>Loading time: </TooltipValueHeader>
            <TooltipValue>{`${turnsLoaded}/${loadingTime}`}</TooltipValue>
          </TooltipEntry>

          <InlineTooltipEntry>
            <TooltipValueHeader>Loaded: </TooltipValueHeader>
            <CargoItem
              cargo={loadedTorpedo ? loadedTorpedo : new NoAmmunitionLoaded()}
              amount={null}
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
