import * as React from "react";
import styled, { css } from "styled-components";
import SystemList from "../system/SystemList";
import EwList from "../electronicWarfare/EwList";
import CCEWButtons from "../electronicWarfare/CCEWButtons";
import GameShipTooltipMenu from "../shipTooltip/GameShipTooltipMenu";

const Container = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: calc(50% - 100px);
  display: flex;
  flex-direction: column;
  z-index: 3;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
`;

class LeftPanel extends React.PureComponent {
  render() {
    const { uiState, systemList, ewList, ...rest } = this.props;

    if (!uiState.state.selectedShip) {
      return null;
    }

    return (
      <Container>
        <SubContainer>
          {ewList && (
            <EwList
              ship={uiState.state.selectedShip}
              uiState={uiState}
              ewList={ewList}
              {...rest}
            />
          )}
        </SubContainer>
        <GameShipTooltipMenu
          ship={uiState.state.selectedShip}
          uiState={uiState}
        />
      </Container>
    );
  }
}

export default LeftPanel;
