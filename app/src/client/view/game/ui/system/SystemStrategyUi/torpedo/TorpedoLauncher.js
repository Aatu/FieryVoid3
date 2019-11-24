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

  loadTorpedo(torpedo) {
    return () => {
      const { ship, launcher, uiState } = this.props;

      launcher.loadAmmo(torpedo);
      uiState.shipSystemStateChanged(ship, launcher.system);
      this.forceUpdate();
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

          <TooltipEntry>
            <TooltipValueHeader>Loaded ammo: </TooltipValueHeader>
            <CargoItem
              cargo={loadedTorpedo ? loadedTorpedo : new NoAmmunitionLoaded()}
              amount={null}
            />
          </TooltipEntry>
        </InlineTooltipEntry>

        <TooltipEntry>
          <TooltipValueHeader>Select torpedo to load: </TooltipValueHeader>
        </TooltipEntry>

        <TorpedoList>
          {launcher.getPossibleTorpedosToLoad().map(({ object, amount }) => (
            <CargoItem
              handleOnClick={this.loadTorpedo(object).bind(this)}
              key={`torpedo-launcer-possible-torpedo-${object.constructor.name}`}
              cargo={object}
              amount={amount}
            />
          ))}
          {loadedTorpedo && (
            <CargoItem
              handleOnClick={this.loadTorpedo(new NoAmmunitionLoaded()).bind(
                this
              )}
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
