import * as React from "react";
import styled from "styled-components";
import { TooltipButton } from "../../../styled";
import { Replay } from "../../../styled/icon";
import { GameUIMode } from "./gameUiModes";
import { useGameStore } from "../GameStoreProvider";
import { useUiStateHandler } from "../../../state/useUIStateHandler";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 500px;
  display: flex;
  z-index: 3;
`;

const ReplayButton = styled(TooltipButton)`
  margin-left: 32px;
`;

const GameUiModeButtons: React.FC = () => {
  const { enemy_weapons, weapons, ew, movement } = useGameStore(
    ({ gameState }) => gameState.gameUiMode
  );

  const uiState = useUiStateHandler();

  return (
    <Container>
      <TooltipButton
        selected={enemy_weapons}
        $img="/img/targetShip.png"
        onClick={() => uiState.toggleGameUiMode(GameUIMode.ENEMY_WEAPONS)}
      />
      <TooltipButton
        selected={weapons}
        $img="/img/firing.png"
        onClick={() => uiState.toggleGameUiMode(GameUIMode.WEAPONS)}
      />
      <TooltipButton
        selected={ew}
        $img="/img/addOEW.png"
        onClick={() => uiState.toggleGameUiMode(GameUIMode.EW)}
      />
      <TooltipButton
        selected={movement}
        $img="/img/selectShip.png"
        onClick={() => uiState.toggleGameUiMode(GameUIMode.MOVEMENT)}
      />
      <ReplayButton onClick={() => uiState.startReplay()}>
        <Replay />
      </ReplayButton>
    </Container>
  );
};

export default GameUiModeButtons;
