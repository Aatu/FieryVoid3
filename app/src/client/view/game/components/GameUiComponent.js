import React, { useContext } from "react";
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
import { StateStore } from "../../../state/StoreProvider";
import { GameStateStore } from "../GameStoreProvider";

const GameUiComponent = ({ game }) => {
  const { currentUser } = useContext(StateStore);
  const state = useContext(GameStateStore);
  const uiState = game.getUiState();

  return (
    <>
      {state.lobby && (
        <Lobby
          uiState={uiState}
          gameData={state.gameData}
          game={game}
          currentUser={currentUser}
        />
      )}

      {state.shipTooltip.map((tooltip, index) => (
        <ShipTooltip
          key={`tooltip-ship-${index}`}
          uiState={uiState}
          {...state}
          {...tooltip}
        />
      ))}

      {state.gameData &&
        (state.gameData.phase === gamePhases.GAME ||
          state.gameData.phase === gamePhases.DEPLOYMENT) && (
          <TurnHeader
            uiState={uiState}
            gameData={uiState.state.gameData}
            ready={uiState.state.turnReady}
            waiting={uiState.state.waiting}
          />
        )}

      {state.shipMovement && state.shipMovement.type === "deploy" && (
        <DeploymentMovement {...state.shipMovement} uiState={uiState} />
      )}

      {state.shipMovement && state.shipMovement.type === "game" && (
        <GameMovement {...state.shipMovement} uiState={uiState} />
      )}

      {state.gameUiModeButtons && (
        <GameUiModeButtons uiState={uiState} {...state.gameUiMode} />
      )}

      {state.replayUi && (
        <ReplayUI uiState={uiState} replayContext={state.replayUi} />
      )}

      <LeftPanel uiState={uiState} {...state} />

      {uiState.state.combatLog && (
        <CombatLog
          uiState={uiState}
          replayContext={state.combatLog.replayContext}
          gameData={state.combatLog.gameData}
          log={state.combatLog.log}
        />
      )}

      {state.shipBadges.map(({ version, icon, getPosition, showName }) => (
        <ShipBadge
          key={`ship-badge-${icon.ship.id}`}
          icon={icon}
          getPosition={getPosition}
          version={version}
          uiState={uiState}
          showName={showName}
        />
      ))}
    </>
  );
};

export default GameUiComponent;
