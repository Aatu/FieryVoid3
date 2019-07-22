import * as React from "react";
import styled, { css } from "styled-components";
import SystemList from "../system/SystemList";
import EwList from "../electronicWarfare/EwList";

const Container = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 33%;
  display: flex;
  flex-direction: column;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
`;

class LeftPanel extends React.PureComponent {
  render() {
    const { uiState, systemList, ewList, ...rest } = this.props;

    return (
      <Container>
        {ewList && (
          <SubContainer>
            <EwList
              ship={uiState.state.selectedShip}
              uiState={uiState}
              ewList={ewList}
              {...rest}
            />
          </SubContainer>
        )}

        {systemList && (
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
