import React, { useMemo } from "react";
import styled from "styled-components";
import EwList from "../electronicWarfare/EwList";
import GameShipTooltipMenu from "../shipTooltip/GameShipTooltipMenu";
import { TOOLTIP_TAB } from "../shipTooltip/ShipTooltip";
import { useGameStore } from "../../GameStoreProvider";

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

const LeftPanel: React.FC = () => {
  const selectedShipId = useGameStore(
    (state) => state.gameState.selectedShipId
  );

  return useMemo(() => {
    if (!selectedShipId) {
      return null;
    }

    return (
      <Container>
        <SubContainer>
          <EwList />
        </SubContainer>
        <GameShipTooltipMenu
          shipId={selectedShipId}
          selectTooltipTab={(tab: TOOLTIP_TAB | null) => {
            console.log("should select tab", tab);
          }}
        />
      </Container>
    );
  }, [selectedShipId]);
};

export default LeftPanel;
