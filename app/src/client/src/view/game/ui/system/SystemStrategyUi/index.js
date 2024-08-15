import React from "react";
import CargoList from "./cargo/CargoList";
import TorpedoLauncher from "./torpedo/TorpedoLauncher";
import Ammo from "./ammo/Ammo";
import RangePenalty from "./range/RangePenalty";
import SystemStrategyUiComponent from "./SystemStrategyUiComponent";

class SystemStrategyUi extends React.Component {
  render() {
    const { ship, uiState, system } = this.props;
    const { currentUser } = uiState.services;

    const myShip = ship.player.is(currentUser);

    return system
      .callHandler("getUiComponents", { myShip }, [])
      .map(({ name, props }, i) => (
        <SystemStrategyUiComponent
          key={`system-stragey-${name}-${system.id}-${i}`}
          uiState={uiState}
          ship={ship}
          system={system}
          name={name}
          {...props}
        />
      ));
  }
}

export default SystemStrategyUi;
