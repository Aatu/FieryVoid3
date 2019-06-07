import * as React from "react";
import Lobby from "./lobby";
import ShipWindowsContainer from "../ui/shipWindow/ShipWindowsContainer";
import ShipTooltip from "../ui/shipTooltip";
import TurnHeader from "../ui/TurnHeader";
import * as gamePhases from "../../../../model/game/gamePhases";

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

        {uiState.state.gameData &&
          (uiState.state.gameData.phase === gamePhases.GAME ||
            uiState.state.gameData.phase === gamePhases.DEPLOYMENT) && (
            <TurnHeader
              uiState={uiState}
              gameData={uiState.state.gameData}
              ready={uiState.state.turnReady}
            />
          )}
      </>
    );
  }
}

export default GameUiComponent;
