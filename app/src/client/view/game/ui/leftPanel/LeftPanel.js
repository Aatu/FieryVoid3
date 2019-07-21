import * as React from "react";
import styled, { css } from "styled-components";
import { TooltipMenu, TooltipButton } from "../../../../styled";
import SystemList from "../system/SystemList";

const Container = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  max-width: 33%;
  display: flex;
  align-items: center;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
`;

class LeftPanel extends React.PureComponent {
  render() {
    const { uiState, systemList, ...rest } = this.props;

    return (
      <Container>
        {uiState.state.systemList && (
          <SubContainer>
            <SystemList
              ship={uiState.state.selectedShip}
              uiState={uiState}
              systems={systemList}
              {...rest}
            />
          </SubContainer>
        )}
      </Container>
    );
  }
}

export default LeftPanel;
