import * as React from "react";
import styled from "styled-components";
import {
  ContainerRoundedRightBottom,
  Title,
  icons,
  SectionRight,
  Section,
  colors,
  TooltipButton
} from "../../../styled";
import * as gamePhases from "../../../../model/game/gamePhases";

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

const ReadyContainer = styled.div`
  ${props => (props.ready ? "cursor:pointer;" : "cursor:not-allowed;")}
`;

class TurnHeader extends React.PureComponent {
  onReady() {
    const { uiState, ready } = this.props;

    if (!ready) {
      return;
    }

    uiState.commitTurn();
  }

  render() {
    const { gameData, ready, waiting } = this.props;
    return (
      <TurnHeaderContainer>
        <Section>
          <Title>
            {`TURN: ${gameData.turn}`}{" "}
            {gameData.phase === gamePhases.DEPLOYMENT && "DEPLOYMENT"}
            {waiting && " Waiting"}
          </Title>
          {!waiting && (
            <ReadySection>
              <TooltipButton onClick={this.onReady.bind(this)}>
                <icons.CheckMark />
              </TooltipButton>
            </ReadySection>
          )}
        </Section>
      </TurnHeaderContainer>
    );
  }
}

export default TurnHeader;
