import React from "react";
import styled from "styled-components";
import EwList from "../electronicWarfare/EwList";
import GameShipTooltipMenu from "../shipTooltip/GameShipTooltipMenu";
import UIState from "../UIState";
import ElectronicWarfareEntry from "@fieryvoid3/model/src/electronicWarfare/ElectronicWarfareEntry";
import { TOOLTIP_TAB } from "../shipTooltip/ShipTooltip";

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

type Props = {
  uiState: UIState;
  ewList: ElectronicWarfareEntry[];
};

const LeftPanel: React.FC<Props> = ({ uiState, ewList }) => {
  const selectedShip = uiState.getSelectedShip();

  if (!selectedShip) {
    return null;
  }

  return (
    <Container>
      <SubContainer>
        {ewList && (
          <EwList ship={selectedShip} uiState={uiState} ewList={ewList} />
        )}
      </SubContainer>
      <GameShipTooltipMenu
        ship={selectedShip}
        uiState={uiState}
        selectTooltipTab={(tab: TOOLTIP_TAB) => {
          console.log("should select tab", tab);
        }}
      />
    </Container>
  );
};

export default LeftPanel;
