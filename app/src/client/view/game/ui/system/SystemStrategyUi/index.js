import React from "react";
import CargoList from "./cargo/CargoList";
import TorpedoLauncher from "./torpedo/TorpedoLauncher";
import Ammo from "./ammo/Ammo";
import RangePenalty from "./range/RangePenalty";

class SystemStrategyUi extends React.Component {
  render() {
    const { ship, uiState, system } = this.props;
    const { currentUser } = uiState.services;

    const myShip = ship.player.is(currentUser);

    return (
      <>
        {system
          .callHandler("getUiComponents", { myShip }, [])
          .map(({ name, props }, i) => {
            switch (name) {
              case "RangePenalty":
                return (
                  <RangePenalty
                    key={`rangePenalty-${name}-index-${i}`}
                    uiState={uiState}
                    ship={ship}
                    {...props}
                  />
                );
              case "Ammo":
                return (
                  <Ammo
                    key={`ammo-${name}-index-${i}`}
                    uiState={uiState}
                    ship={ship}
                    {...props}
                  />
                );
              case "CargoList":
                return (
                  <CargoList
                    key={`cargo-item-${name}-index-${i}`}
                    uiState={uiState}
                    ship={ship}
                    {...props}
                  />
                );
              case "TorpedoLauncher":
                return (
                  <TorpedoLauncher
                    key={`torpedo-launcher-${name}-index-${i}`}
                    uiState={uiState}
                    ship={ship}
                    {...props}
                  />
                );
            }
          })}
      </>
    );
  }
}

export default SystemStrategyUi;
