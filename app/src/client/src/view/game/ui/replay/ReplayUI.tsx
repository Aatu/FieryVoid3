import * as React from "react";
import styled from "styled-components";
import { TooltipButton, Button } from "../../../../styled";
import { Pause, Play, X } from "../../../../styled/icon";
import UIState from "../UIState";
import ReplayContext from "../../phase/phaseStrategy/AutomaticReplayPhaseStrategy/ReplayContext";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 500px;
  display: flex;
  z-index: 3;
`;

const RotatedButton = styled(TooltipButton)`
  transform: rotate(180deg);
`;

const ReplayUi: React.FC<{
  uiState: UIState;
  replayContext: ReplayContext;
}> = ({ uiState, replayContext }) => {
  return (
    <Container>
      <Button onClick={() => replayContext.rewindToFiring()}>Firing</Button>

      <RotatedButton onClick={() => replayContext.resumeReplayRewind()}>
        <Play />
      </RotatedButton>
      <TooltipButton onClick={() => replayContext.pauseReplay()}>
        <Pause />
      </TooltipButton>
      <TooltipButton onClick={() => replayContext.resumeReplay()}>
        <Play />
      </TooltipButton>
      <TooltipButton onClick={() => uiState.closeReplay()}>
        <X />
      </TooltipButton>
    </Container>
  );
};

export default ReplayUi;
