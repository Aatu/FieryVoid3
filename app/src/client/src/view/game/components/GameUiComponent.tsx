import React from "react";
import Lobby from "./lobby";
import ShipTooltip from "../ui/shipTooltip";
import TurnHeader from "../ui/TurnHeader";
import GameMovement from "../ui/movement/GameMovement";
import DeploymentMovement from "../ui/movement/DeploymentMovement";
import GameUiModeButtons from "../ui/GameUiModeButtons";
import LeftPanel from "../ui/leftPanel/LeftPanel";
import ReplayUI from "../ui/replay/ReplayUI";
import CombatLog from "../ui/combatLog/CombatLog";
import ShipBadge from "../ui/shipBadge/ShipBadge";
import ShipList from "../ui/shipList/ShipList";
import Game from "../Game";
import { useUser } from "../../../state/userHooks";
import { GAME_PHASE } from "@fieryvoid3/model/src/game/gamePhase";
import { GameUIMode } from "../ui/gameUiModes";

const GameUiComponent: React.FC<{ game: Game }> = ({ game }) => {
  const { data: currentUser } = useUser();
  const uiState = game.getUiState();
  const state = uiState.getState();

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

      <>
        {
          state.shipTooltip
            .map((tooltip) => (
              <ShipTooltip
                key={`tooltip-ship-${tooltip.ship.id}`}
                uiState={uiState}
                {...state}
                {...tooltip}
              />
            ))
            .filter(Boolean) as React.ReactNode
        }
      </>

      {state.gameData &&
        (state.gameData.phase === GAME_PHASE.GAME ||
          state.gameData.phase === GAME_PHASE.DEPLOYMENT) && (
          <TurnHeader
            uiState={uiState}
            ready={state.turnReady}
            waiting={state.waiting}
          />
        )}

      {state.shipMovement &&
        state.shipMovement.type === GAME_PHASE.DEPLOYMENT && (
          <DeploymentMovement {...state.shipMovement} />
        )}

      {state.shipMovement &&
        state.shipMovement.type === GAME_PHASE.GAME &&
        uiState.hasGameUiMode(GameUIMode.MOVEMENT) && (
          <GameMovement {...state.shipMovement} />
        )}

      {state.gameUiModeButtons && (
        <GameUiModeButtons uiState={uiState} {...state.gameUiMode} />
      )}

      {state.replayUi && (
        <ReplayUI uiState={uiState} replayContext={state.replayUi} />
      )}

      {!state.replayUi && <LeftPanel uiState={uiState} {...state} />}

      {state.combatLog && (
        <CombatLog
          replayContext={state.combatLog.replayContext}
          gameData={state.combatLog.gameData}
          log={state.combatLog.log}
        />
      )}

      {state.shipBadges.map(({ icon, visible, showName }) => (
        <ShipBadge
          key={`ship-badge-${icon.ship.id}`}
          shipObject={icon}
          visible={visible}
          uiState={uiState}
          showName={showName}
        />
      ))}

      <ShipList uiState={uiState} />
    </>
  );
};

export default GameUiComponent;
