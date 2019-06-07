import * as React from "react";
import styled from "styled-components";
import {
  ContainerRoundedRightBottom,
  Title,
  icons,
  SectionRight,
  Section,
  colors
} from "../../../styled";
import * as gamePhases from "../../../../model/game/gamePhases";

const TurnHeaderContainer = styled(ContainerRoundedRightBottom)`
  position: absolute;
  top: -1px;
  left: -1px;
  width: 300px;
  padding-right: 10px;
`;

const ReadySection = styled(SectionRight)`
  align-items: center;
`;

const ReadyContainer = styled.div`
  ${props => (props.ready ? "cursor:pointer;" : "cursor:not-allowed;")}
`;

class TurnHeader extends React.PureComponent {
  render() {
    const { gameData, ready } = this.props;
    return (
      <TurnHeaderContainer>
        <Section>
          <Title>
            {`TURN: ${gameData.turn}`}{" "}
            {gameData.phase === gamePhases.DEPLOYMENT && "DEPLOYMENT"}
          </Title>
          <ReadySection>
            <ReadyContainer ready={ready}>
              <icons.CheckMark
                size={30}
                ready={ready}
                color={ready ? "#fff" : colors.border}
              />
            </ReadyContainer>
          </ReadySection>
        </Section>
      </TurnHeaderContainer>
    );
  }
}

export default TurnHeader;
