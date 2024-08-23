import * as React from "react";
import styled from "styled-components";
import {
  Title,
  icons,
  SectionRight,
  Section,
  TooltipButton,
} from "../../../styled";
import UIState from "./UIState";
import { GAME_PHASE } from "@fieryvoid3/model/src/game/gamePhase";

const TurnHeaderContainer = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  padding-right: 10px;
  z-index: 3;
`;

const ReadySection = styled(SectionRight)`
  align-items: center;
`;

const TurnHeader: React.FC<{
  uiState: UIState;
  ready: boolean;
  waiting: boolean;
}> = ({ uiState, ready, waiting }) => {
  const onReady = () => {
    if (!ready) {
      return;
    }

    uiState.commitTurn();
  };

  const gameData = uiState.getGameData();

  return (
    <TurnHeaderContainer>
      <Section>
        <Title>
          {`TURN: ${gameData.turn}`}{" "}
          {gameData.phase === GAME_PHASE.DEPLOYMENT && "DEPLOYMENT"}
          {waiting && " Waiting"}
        </Title>
        {!waiting && ready && (
          <ReadySection>
            <TooltipButton onClick={onReady}>
              <icons.CheckMark />
            </TooltipButton>
          </ReadySection>
        )}
      </Section>
    </TurnHeaderContainer>
  );
};

export default TurnHeader;
