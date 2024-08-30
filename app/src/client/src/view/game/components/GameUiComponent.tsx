import React, { memo } from "react";
import Lobby from "./lobby";
import ShipTooltip from "../ui/shipTooltip";
import TurnHeader from "../ui/TurnHeader";
import GameMovement from "../ui/movement/GameMovement";
import DeploymentMovement from "../ui/movement/DeploymentMovement";
import GameUiModeButtons from "../ui/GameUiModeButtons";
import LeftPanel from "../ui/leftPanel/LeftPanel";
import ReplayUI from "../ui/replay/ReplayUI";
import CombatLog from "../ui/combatLog/CombatLog";
import { ShipBadges } from "../ui/shipBadge/ShipBadge";
import ShipList from "../ui/shipList/ShipList";
import { GAME_PHASE } from "@fieryvoid3/model/src/game/gamePhase";
import { GameUIMode } from "../ui/gameUiModes";
import { useUiStateHandler } from "../../../state/useUIStateHandler";
import { useGameStore } from "../GameStoreProvider";
import { useGameData } from "../../../state/useGameData";

const GameUiComponent: React.FC = memo(() => {
  const uiState = useUiStateHandler();
  const state = useGameStore(({ gameState }) => gameState);

  const gameData = useGameData();

  return (
    <>
      {state.lobby && <Lobby uiState={uiState} gameData={gameData} />}

      <>
        {
          state.shipTooltip
            .map((tooltip) => (
              <ShipTooltip
                key={`tooltip-ship-${tooltip.ship.id}`}
                {...tooltip}
              />
            ))
            .filter(Boolean) as React.ReactNode
        }
      </>

      {gameData &&
        (gameData.phase === GAME_PHASE.GAME ||
          gameData.phase === GAME_PHASE.DEPLOYMENT) && (
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

      {state.gameUiModeButtons && <GameUiModeButtons />}

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

      <ShipBadges />

      <ShipList />
    </>
  );
});

export default GameUiComponent;
