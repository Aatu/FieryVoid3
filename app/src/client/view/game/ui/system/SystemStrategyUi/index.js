import React from "react";
import CargoList from "./cargo/CargoList";
import TorpedoLauncher from "./torpedo/TorpedoLauncher";

class SystemStrategyUi extends React.Component {
  render() {
    const { ship, uiState, system } = this.props;

    return (
      <>
        {system
          .callHandler("getUiComponents", null, [])
          .map(({ name, props }, i) => {
            switch (name) {
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
