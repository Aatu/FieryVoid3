import * as React from "react";
import Lobby from "./lobby";
import ShipWindowsContainer from "../ui/shipWindow/ShipWindowsContainer";
import ShipTooltip from "../ui/shipTooltip";

class GameUiComponent extends React.Component {
  render() {
    const { uiState, game, user } = this.props;

    if (!uiState) {
      return null;
    }

    return (
      <>
        {uiState.state.lobby && (
          <Lobby
            uiState={uiState}
            gameData={uiState.state.gameData}
            game={game}
            currentUser={user}
          />
        )}

        {uiState.state.shipWindows && (
          <ShipWindowsContainer
            uiState={uiState}
            {...uiState.state.shipWindows}
          />
        )}

        {uiState.state.shipTooltip.map((tooltip, index) => (
          <ShipTooltip
            key={`tooltip-ship-${index}`}
            uiState={uiState}
            {...uiState.state}
            {...tooltip}
          />
        ))}
      </>
    );
  }
}

export default GameUiComponent;
