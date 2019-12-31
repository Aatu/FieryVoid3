import * as React from "react";
import Lobby from "./lobby";
import ShipTooltip from "../ui/shipTooltip";
import TurnHeader from "../ui/TurnHeader";
import GameMovement from "../ui/movement/GameMovement";
import DeploymentMovement from "../ui/movement/DeploymentMovement";
import GameUiModeButtons from "../ui/GameUiModeButtons";
import LeftPanel from "../ui/leftPanel/LeftPanel";
import ReplayUI from "../ui/replay/ReplayUI";
import * as gamePhases from "../../../../model/game/gamePhases";
import CombatLog from "../ui/combatLog/CombatLog";
import ShipBadge from "../ui/shipBadge/ShipBadge";

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
              waiting={uiState.state.waiting}
            />
          )}

        {uiState.state.shipMovement &&
          uiState.state.shipMovement.type === "deploy" && (
            <DeploymentMovement
              {...uiState.state.shipMovement}
              uiState={uiState}
            />
          )}

        {uiState.state.shipMovement &&
          uiState.state.shipMovement.type === "game" && (
            <GameMovement {...uiState.state.shipMovement} uiState={uiState} />
          )}

        {uiState.state.gameUiModeButtons && (
          <GameUiModeButtons uiState={uiState} {...uiState.state.gameUiMode} />
        )}

        {uiState.state.replayUi && (
          <ReplayUI uiState={uiState} replayContext={uiState.state.replayUi} />
        )}

        <LeftPanel uiState={uiState} {...uiState.state} />

        {uiState.state.combatLog && (
          <CombatLog
            uiState={uiState}
            replayContext={uiState.state.combatLog.replayContext}
            gameData={uiState.state.combatLog.gameData}
            log={uiState.state.combatLog.log}
          />
        )}

        {uiState.state.shipBadges.map(
          ({ version, icon, getPosition, showName }) => (
            <ShipBadge
              key={`ship-badge-${icon.ship.id}`}
              icon={icon}
              getPosition={getPosition}
              version={version}
              uiState={uiState}
              showName={showName}
            />
          )
        )}
      </>
    );
  }
}

export default GameUiComponent;
