import * as React from "react";
import styled from "styled-components";
import { TooltipButton, Button } from "../../../../styled";
import { Pause, Play, X } from "../../../../styled/icon";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 500px;
  display: flex;
`;

class ReplayUi extends React.PureComponent {
  render() {
    const { uiState, replayContext } = this.props;

    return (
      <Container>
        <Button onClick={() => replayContext.rewindToFiring()}>Firing</Button>
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
  }
}

export default ReplayUi;
